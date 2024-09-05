import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UserResponse } from './user-response';

@Injectable({
  providedIn: 'root'
})
export class PTKStorageService {
  // class to save user in localStorage
  constructor() {}

  saveUser(user_logged: HttpResponse<Object>): void {
    // method to save user in localStorage
    let user = (user_logged.body as UserResponse);

    localStorage.setItem('user_id', user.user_id.toString());
    localStorage.setItem('user_name', user.user_name);
    localStorage.setItem('user_role', user.user_role);
    localStorage.setItem('user_email', user.user_email);
    localStorage.setItem('token_access', user.token_access);
    localStorage.setItem('token_refresh', user.token_refresh);
    // date when token create
    localStorage.setItem('token_date', (new Date().getTime()).toString());
  }

  getUser(): UserResponse {
    // methis to get user data saved on localStorage

    const user: UserResponse = {
      user_id: Number(localStorage.getItem('user_id')),
      user_name: localStorage.getItem('user_name')!,
      user_role: localStorage.getItem('user_role')!,
      user_email: localStorage.getItem('user_email')!,
      token_access: localStorage.getItem('token_access')!,
      token_refresh: localStorage.getItem('token_refresh')!
    }

    return user;
  }

  updateTokenAccess(token_access: string): void {
    //method to update token_access when token_access expire
    localStorage.setItem('token_access', token_access);
    localStorage.setItem('token_date', (new Date().getTime().toString()));
  }

  getToken(): {token_access: string, token_refresh: string} {
    //method to get Tokens from user (access, refresh)

    return {        
      token_access: localStorage.getItem('token_access')!,
      token_refresh: localStorage.getItem('token_refresh')!
    }
  }

  clearStorage(): void {
    // method to clear al localstorage when user can not update
    localStorage.clear();
  }
}
