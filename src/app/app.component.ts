import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { PTKStorageService } from './ptk-storage.service';
import { OnInit, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UserResponse } from './user-response';
import { PTKRefreshTokenService, PTKTokenApi } from './ptk-api.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    NgIf,
    // import logincomponet to activate navbar after login
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ptk_platform_spa';
  isLogged = false;
  user: UserResponse | null = null;

  constructor(
    private ptkTokenApi: PTKTokenApi,
    private ptkStorage: PTKStorageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ptkRefreshToken: PTKRefreshTokenService,
  ) {
    
    if (this.platformId === 'browser') {
      let token = this.ptkStorage.getToken();

      if (token.token_access !== null) {
        //verify the life of token to refresh
        const token_date = Number(localStorage.getItem('token_date'));
        const actual_date = new Date().getTime();
        const token_life = (actual_date-token_date)/(1000 * 60);
        console.log('token life');
        console.log(token_life);
        const start_refresh_in: number =Math.floor(
          token_life < 4 ? (((4-token_life)/2) * 60000) : 1
        );
        console.log(start_refresh_in);

        const ngZone = inject(NgZone);
        /*
        ngZone.runOutsideAngular(() => {
          this.ptkRefreshToken.startRefreshTokenTimer(start_refresh_in).subscribe(() => {
            this.ptkTokenApi.refreshToken().then((mensaje) => {

            }).catch(() => { });
          });
        });*/

        ngZone.runOutsideAngular(() => {
          this.ptkRefreshToken.startRefreshTokenTimer(start_refresh_in)
          .subscribe({
            next(value): void {
              console.log('correcto');
            },
            error(err): void {
              console.log(err);
              localStorage.clear();
              window.location.href = '/login';
            },
            complete(): void {
              // nothing
            },
          });
        });
      }
    }
  }

  ngOnInit(): void {
    if (this.platformId === 'browser') {
      let token = this.ptkStorage.getToken();

      if (token.token_access !== null) {
        this.isLogged = true;
        this.user = this.ptkStorage.getUser();
      }
    }
  }

  // this function activate navbar after if login is success
  activateNavbar(): void {
    this.user = this.ptkStorage.getUser();
    this.isLogged = true;
  }

  refreshToken(): void {

  }
}
