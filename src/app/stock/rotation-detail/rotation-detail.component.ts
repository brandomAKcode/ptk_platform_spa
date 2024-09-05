import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PTKDealerApiService } from '../../ptk-api.service';
import { ActivatedRoute } from '@angular/router';
import { PTKProductsList } from '../../ptk-product';

interface Rotation {
  id: number,
  pending: boolean,
  date: string,
  user: number
}

@Component({
  selector: 'app-rotation-detail',
  standalone: true,
  imports: [],
  templateUrl: './rotation-detail.component.html',
  styleUrl: './rotation-detail.component.css'
})
export class RotationDetailComponent implements OnInit {
  rotation_pending: boolean = false;
  rotation_products: Array<{id: number, quantity: number, rotation: number, product: number}> | null = null;
  rotation_id: number | null = null;
  product_lits = PTKProductsList;

  constructor(private ptkDealerApi: PTKDealerApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getRotationPending();
    this.getRotationDetail();
  }

  getRotationPending(): void {
    this.ptkDealerApi.request(this.ptkDealerApi.getRotationPending())
      .then((result) => {
        this.rotation_pending = Object.keys((result as Rotation | {})).length > 0 ? true : false;
      }).catch((error) => {
        this.ptkDealerApi.delayRetrying().subscribe(
          {
            next: (data) => {
              console.log('Retrying');
              this.getRotationPending();
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => console.info('complete')
          }
        );
      });
  }

  getRotationDetail(): void {
    this.ptkDealerApi.request(this.ptkDealerApi.getRotationDetail(Number(this.route.snapshot.paramMap.get('id'))))
      .then((result) => {
        console.log(result);
        this.rotation_products = (result as Array<{id: number, quantity: number, rotation: number, product: number}>);
      }).catch((error) => {
        
        this.ptkDealerApi.delayRetrying().subscribe(
          {
            next: (data) => {
              console.log('Retrying');
              this.getRotationDetail();
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => console.info('complete')
          }
        );
        
      });
  }
}
