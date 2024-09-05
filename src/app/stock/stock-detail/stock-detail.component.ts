import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PTKProduct, PTKProductsList } from '../../ptk-product';
import { PTKDealerApiService } from '../../ptk-api.service';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [],
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.css'
})
export class StockDetailComponent implements OnInit {
  products: Array<PTKProduct> | null = null;
  stock_tile_view: Boolean = true;

  constructor(private ptkDealerApi: PTKDealerApiService) { }

  ngOnInit(): void {
    this.getProductsInStock();
  }

  getProductsInStock(): void {
    this.ptkDealerApi.request(this.ptkDealerApi.getProductsInStock())
      .then((result) => {
        this.products = (result as Array<PTKProduct>);
        console.log('pidiendo productos');
        console.log(result);
      }).catch((error) => {
        this.ptkDealerApi.delayRetrying().subscribe(
          {
            next: (data) => {
              console.log('Retrying');
              this.getProductsInStock();
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => console.info('complete')
          }
        );
      });
  }

  getProductInformation(product_id: number) {
    return PTKProductsList[product_id];
  }
}
