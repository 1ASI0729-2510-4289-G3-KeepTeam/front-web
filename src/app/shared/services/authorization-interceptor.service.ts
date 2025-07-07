import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenStorageService} from "./tokenStorage.service";
import {Observable} from "rxjs";

const TOKEN_HEADER_KEY = 'Authorization';
/**
 * HTTP interceptor that attaches the Authorization header with a Bearer token to outgoing HTTP requests.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor{
  /**
   * Creates an instance of the AuthInterceptor.
   *
   * @param tokenStorageService Service that retrieves the stored authentication token.
   */
  constructor(private tokenStorageService: TokenStorageService) { }
  /**
   * Intercepts HTTP requests and adds the Authorization header if a token is available.
   *
   * @param request The outgoing HTTP request.
   * @param next The next HTTP handler in the request chain.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authRequest = request;
    const token = this.tokenStorageService.getToken();
    console.log('Token:', token); // Log the token value
    if (token != null) {
      authRequest = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authRequest);
  }
}
/**
 * Provider definition for registering the AuthInterceptor globally in the application.
 */
export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
]
