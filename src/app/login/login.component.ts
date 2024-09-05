import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { PTKLoginApi } from '../ptk-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  userLoginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  buttonLogin: any;
  // show message to check credential and disabled button
  checkingCredentials: Boolean = false;
  // event to activate navbar in app-component
  @Output() activateNavbar = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ptkLoginApi: PTKLoginApi
  ) { }

  onSubmit() {
    let email = this.userLoginForm.get('email')!.value;
    let password = this.userLoginForm.get('password')!.value;

    if (email !== "" && password !== "") {
      // use service of PtkBaseApi to login
      this.ptkLoginApi.login(email!, password!)
        .then(data => {
          // activate navbar
          this.activateNavbar.emit()
          if (localStorage.getItem('user_role') == 'DEA') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/admin/dashboard']);
          }
        })
        .catch(error => console.error(error));
    }

  }

  clickLogin() {
    /*  this moment we using clickLogin to evit
    propagation */
    console.log('login');
    // disabled button y show messahe checking credentials
    this.checkingCredentials = true;
    this.onSubmit();
  }
}
