import { Injectable } from "@angular/core";
import { HttpInterceptor } from "@angular/common/http";
import { HttpRequest, HttpHandler, HttpEvent, HttpContextToken, HttpContext, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

// Declare http context tokens here...
const REQUEST_NEED_TOKEN = new HttpContextToken<boolean>(() => false);

// Declare functis using context token to set them true
export function needApiToken() {
    return new HttpContext().set(REQUEST_NEED_TOKEN, true);
}

Injectable({
    providedIn: 'root'
})
export class LoggingInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Please wait while we are logging in the user.");
        return handler.handle(req);
    }
}

Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        // verify if request need token_access
        if (req.context.get(REQUEST_NEED_TOKEN)) {
            const token_access: string = localStorage.getItem('token_access')!;
            const http_headers = new HttpHeaders({
                'Authorization': `Bearer ${token_access}`
            });

            const req_with_token = req.clone({
                headers: http_headers
            })
            return handler.handle(req_with_token);
        }
        return handler.handle(req);
    }
}