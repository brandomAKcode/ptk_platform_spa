import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { PTKDealerApiService } from '../ptk-api.service';
import { OnInit } from '@angular/core';
import { PTKStorageService } from '../ptk-storage.service';
import { UserResponse } from '../user-response';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { takeWhile, delay, tap, interval, take } from 'rxjs';
import internal from 'stream';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  host: {
    class: 'fixed-grid has-4-cols'
  }
})
export class DashboardComponent implements OnInit {
  texto: any;
  user: UserResponse | null = null;
  count_products_in_stock: number = 0;

  constructor(
    private ptkApiDealer: PTKDealerApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ptkStorage: PTKStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.platformId === 'browser') {
      this.user = this.ptkStorage.getUser();
      this.countProductsInStock();
    }
  }

  status(): void {
    this.ptkApiDealer.getTest().subscribe(
      {
        next: (data) => {
          this.texto = data;
          console.log('o si');
          console.log(data);
        },
        error: (error) => {
          console.error('entra,os en error =======>')
          console.error(error);
        },
        complete: () => console.info('complete')
      }
    );
  }

  countProductsInStock(): void {
    this.ptkApiDealer.request(this.ptkApiDealer.countProductsInStock())
      .then((result) => {
        this.count_products_in_stock = (result as { count: number }).count;
        console.log(result);
      }).catch((error) => {
        this.ptkApiDealer.delayRetrying().subscribe(
          {
            next: (data) => {
              console.log('Retrying');
              this.countProductsInStock();
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
