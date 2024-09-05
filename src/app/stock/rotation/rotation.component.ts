import { Component } from '@angular/core';
import { PTKDealerApiService } from '../../ptk-api.service';
import { OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Rotation {
  id: number,
  pending: boolean,
  date: string,
  user: number
}

@Component({
  selector: 'app-rotation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './rotation.component.html',
  styleUrl: './rotation.component.css'
})
export class RotationComponent implements OnInit{
  rotation_pending: boolean = false;
  rotation_list: Array<Rotation> | null = null;

  constructor(private ptkDealerApi: PTKDealerApiService) {}

  ngOnInit(): void {
    this.getRotationPending();
    this.getRotationList();
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

  getRotationList(): void {
    this.ptkDealerApi.request(this.ptkDealerApi.getRotationList())
      .then((result) => {
        this.rotation_list = (result as Array<Rotation>);
        console.log('rotation list');
        console.log(this.rotation_list);
      }).catch((error) => {
        this.ptkDealerApi.delayRetrying().subscribe(
          {
            next: (data) => {
              console.log('Retrying');
              this.getRotationList();
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
