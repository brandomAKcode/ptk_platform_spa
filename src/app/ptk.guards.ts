import { CanActivateFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PTKIDBToken } from './ptk.idbToken';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

// Using injectable to prevent SSR
@Injectable({
  providedIn: 'root'
})
export class PTKLoginGuard {
  constructor(private http: HttpClient, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window === 'undefined') {
      console.log("ssr");
      return true;
    } else {
      // get data for acces
      let token_acces = localStorage.getItem('token_access');
      // if token is null, the user can login into platform
      if (token_acces === null) {
        return true;
      } else {
        this.router.navigate(['/dashboard']);
      }
    }

    return false;
  }
}

// Using injectable to prevent SSR
@Injectable({
  providedIn: 'root'
})
export class PTKDealerGuard {
  constructor(private http: HttpClient, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window === 'undefined') {
      return true;
    } else {
      // get data for acces
      const token_acces = localStorage.getItem('token_access');
      const user_role = localStorage.getItem('user_role');
  
      if (token_acces !== null ) {
        if (user_role === 'DEA') {
          return true;
        } else if (user_role === 'ADM') {          
          this.router.navigate(['/admin/dashboard']);
          return false;
        } else {
          localStorage.clear();
          this.router.navigate(['/login']);  
          return false;
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
      return false;
    }
  }
}

// Using injectable to prevent SSR
@Injectable({
  providedIn: 'root'
})
export class PTKAdminGuard {
  constructor(private http: HttpClient, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window === 'undefined') {
      return true;
    } else {
      // get data for acces
      const token_acces = localStorage.getItem('token_access');
      const user_role = localStorage.getItem('user_role');
  
      if (token_acces !== null ) {
        if (user_role === 'ADM') {
          return true;
        } else if (user_role === 'DEA') {          
          this.router.navigate(['/dashboard']);
          return false;
        } else {
          localStorage.clear();
          this.router.navigate(['/login']);  
          return false;
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
      return false;
    }
  }
}