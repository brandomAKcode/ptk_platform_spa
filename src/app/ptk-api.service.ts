import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { PTKStorageService } from './ptk-storage.service';
import { Observable, take } from 'rxjs';
import { interval, catchError, timer, map, throwError } from 'rxjs';
import { needApiToken } from './ptk.interceptors';

@Injectable({
  providedIn: 'root'
})
class PTKBaseApi {
  /* Base class containing the main API URL */
  api_server: string = 'http://localhost:8000';
}

@Injectable({
  providedIn: 'root'
})
export class PTKTokenApi extends PTKBaseApi {
  /* Class containing 2 main methods to be able to make requests to the main API */
  constructor(private http: HttpClient, private ptkStorage: PTKStorageService) {
    super();
  }

  refreshToken(): Promise<string> {
    const user_token_refresh: string = this.ptkStorage.getToken().token_refresh!;
    const user_data = { 'refresh': user_token_refresh };

    return new Promise((resolve, reject) => {
      this.http.post(`${this.api_server}/api/token/refresh/`, user_data, {
        observe: 'response'
      }).subscribe(
        {
          next: (data) => {
            if (data.status == 200) {
              // save data user
              let token_acces: string = (data.body as { access: string }).access;
              this.ptkStorage.updateTokenAccess(token_acces);
              resolve("Refresh");
            }
          },
          error: (error) => {
            reject(error);
          },
          complete: () => console.info('complete')
        }
      );
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class PTKRefreshTokenService {
  private refreshInterval = 4 * 60 * 1000; // 4 minutos en milisegundos 

  constructor(private ptkTokenApi: PTKTokenApi) { }

  startRefreshTokenTimer(start: number) {
    return timer(start, this.refreshInterval).pipe(
      map(time => {
        this.ptkTokenApi.refreshToken().then((mensaje) => {
          return true;
        }).catch(() => {
          throw new Error('Error when refresh Token');
        });
      }),
      catchError(error => {
        console.error('Error when refresh token:', error);
        return error;
      })
    );
  }

}

@Injectable({
  providedIn: 'root'
})
class PTKRequestApi extends PTKBaseApi {
  /* Crucial class for making API requests, verifies the token and updates it if invalid to enable requests */
  request(request: Promise<HttpResponse<Object>>, method: string = 'GET', data: object = {}): Promise<Object> {
    /* This method allows making requests to the API. Before making a request,
    it checks if the token is still valid and refreshes it if it is not.*/
    if (method == 'GET') {
      return new Promise((resolve, reject) => {
        // We check if the token was created less than 4 minutes ago before making the request. If not, we refresh the token.
        request.then((result) => {
          resolve((result as HttpResponse<Object>).body!);
        }).catch((error) => {
          reject(error);
        });
      })
    } else {
      return new Promise((resolve, reject) => {
        // We check if the token was created less than 4 minutes ago before making the request. If not, we refresh the token.
        request.then((result) => {
          resolve((result as HttpResponse<Object>).body!);
        }).catch((error) => {
          reject(error);
        });
      })
    }
  }

  getRequest(http: HttpClient, api_url: string): Promise<HttpResponse<Object>> {
    return new Promise((resolve, reject) => {
      http.get(api_url, {
        observe: 'response',
        context: needApiToken(),
      }).subscribe(
        {
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);

          },
          complete: () => console.info('complete')
        }
      );
    });
  }

  postRequest(http: HttpClient, api_url: string, data: any): Promise<HttpResponse<Object>> {
    return new Promise((resolve, reject) => {
      http.post(api_url, data, {
        observe: 'response',
        context: needApiToken(),
      }).subscribe(
        {
          next: (data) => {
            if (data.status == 200) {
              // save data user
              console.log('========== update')
              resolve(data);
            }
          },
          error: (error) => {
            reject(error);
          },
          complete: () => console.info('complete')
        }
      );
    });
  }

  delayRetrying(): Observable<any> {
    // API request retry mechanism, wait 3 secon to retry
    return interval(3000).pipe(take(1));
  }
}

@Injectable({
  providedIn: 'root'
})
/* Class exclusively for user login to the platform */
export class PTKLoginApi extends PTKBaseApi {

  constructor(private http: HttpClient, private ptkStorage: PTKStorageService) {
    super();
  }

  login(email: string, password: string): Promise<string> {
    // request to login user to save user data on localStorage
    let user_data = { email: email, password: password };

    return new Promise((resolve, reject) => {
      this.http.post(`${this.api_server}/api/token/`, user_data, {
        observe: 'response',
      }).subscribe(
        {
          next: (data) => {
            if (data.status == 200) {
              // save data user
              let save_result = this.ptkStorage.saveUser(data);
              resolve('Usuario logueado');
            }
          },
          error: (error) => {
            reject(error);
          },
          complete: () => console.info('complete')
        }
      );
    });
  }
}

@Injectable({
  providedIn: 'root'
})
/* Class exclusively for making API requests as a distributor */
export class PTKDealerApiService extends PTKRequestApi {
  // class to connect dealer to api
  constructor(
    private http: HttpClient,
    private ptkStorage: PTKStorageService
  ) {
    super();
  }

  getTest(): Observable<any> {
    // token access to request
    return this.http.get(`${this.api_server}/user-token-access-valid/`, {
      observe: 'response'
    });
  }

  /* request to Dashboard */
  countProductsInStock(): Promise<HttpResponse<Object>> {
    return this.getRequest(this.http, `${this.api_server}/stock/count-products-in-stock/`);
  }

  /* request to stock detail */
  getProductsInStock(): Promise<HttpResponse<Object>> {
    return this.getRequest(this.http, `${this.api_server}/stock/products-in-stock/`);
  }

  /* request to rotation */
  getRotationPending(): Promise<HttpResponse<Object>> {
    return this.getRequest(this.http, `${this.api_server}/stock/rotation-pending/`);
  }

  getRotationDetail(id: number): Promise<HttpResponse<Object>> {
    return this.getRequest(this.http, `${this.api_server}/stock/rotation-detail/${id}/`);
  }

  getRotationList(): Promise<HttpResponse<Object>> {
    return this.getRequest(this.http, `${this.api_server}/stock/rotation-list/`);
  }

  updateRotation(data: { rotation_id: number, rotation_products: Array<object> }): Promise<HttpResponse<object>> {
    return this.postRequest(this.http, `${this.api_server}/stock/rotation-update/`, data);
  }
}

export class PTKadminApiService {

  constructor() { }
}