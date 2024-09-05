import { Component } from '@angular/core';
import { PTKDealerApiService } from '../../ptk-api.service';
import { PTKProductsList } from '../../ptk-product';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Rotation {
  id: number,
  pending: boolean,
  date: string,
  user: number
}

@Component({
  selector: 'app-send-rotation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './send-rotation.component.html',
  styleUrl: './send-rotation.component.css'
})
export class SendRotationComponent {
  rotation_id: number | null = null;
  rotation_pending: boolean = false;
  rotation_information: Rotation | null = null;
  rotation_products: Array<{ id: number, name: string, quantity: number }> = [];
  ptk_product_list: Array<{ id: number, name: string } | null> = [];
  product_select: string = 'default'
  product_quantity: number = 1;
  product_img: string = 'img/products/pegatanke_default.png';
  show_image: Boolean = true;
  is_submit: Boolean = false;
  open_modal: Boolean = false;
  success_modal: Boolean = false;

  constructor(private ptkDealerApi: PTKDealerApiService, private router: Router) { }

  ngOnInit(): void {
    this.getRotationPending();

    for (let x of Object.keys(PTKProductsList)) {
      this.ptk_product_list.push({ id: Number(x), name: PTKProductsList[Number(x)].name });
    }
    console.log(this.ptk_product_list);
  }

  getRotationPending(): void {
    this.ptkDealerApi.request(this.ptkDealerApi.getRotationPending())
      .then((result) => {
        this.rotation_pending = Object.keys((result as Rotation | {})).length > 0 ? true : false;
        this.rotation_id = this.rotation_pending ? (result as Array<Rotation>)[0].id : null;
        this.rotation_information = this.rotation_pending ? (result as Rotation) : null;
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

  // method to get image to the product
  getImageProduct(id: number): string {
    return PTKProductsList[id].img;
  }

  // method to get change of select tag
  selectProduct(event: Event): void {
    this.show_image = !this.show_image;
    if (this.product_select === 'default') {
      this.is_submit = false;
      this.product_img = 'img/products/pegatanke_default.png';
    } else {
      this.product_img = PTKProductsList[Number(this.product_select)].img;
      this.is_submit = true;
    }
  }

  // modal methods
  openModal(): void {
    this.open_modal = true;
  }

  closeModal(): void {
    this.open_modal = false;
  }

  // method when user click in ok button
  addProductToRotation(): void {
    this.is_submit = false;
    const product_id:number = Number(this.product_select);
    const product_quantity: number = this.product_quantity;
    const product = PTKProductsList[product_id];

    // add product to table rotation
    this.rotation_products.push(
      { id: product_id, name: product.name, quantity: product_quantity }
    )

    // close modal
    this.open_modal = false;

    // restore select and input number to default
    this.product_select = 'default';
    this.product_quantity = 1;
    this.product_img = 'img/products/pegatanke_default.png';
  }

  deleteProductToRoration(index: number): void {
    this.rotation_products.splice(index, 1);
  }

  deleAllProductsToRotation(): void {
    this.rotation_products = [];
  }

  sendRotation(): void {
    const data = {
      rotation_id: this.rotation_id!,
      rotation_products: this.rotation_products
    }

    console.log(data);

    this.ptkDealerApi.request(this.ptkDealerApi.updateRotation(data), 'POST')
      .then((result) => {
        this.success_modal = true;
        console.log('ready baby');
      }).catch((error) => {
        console.log(error);
        /*
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
        );*/
      });
  }

  ok(): void {
    this.router.navigate(['/stock/rotation']);
  }
}
