import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment.development';

const AUTH_API = 'http://localhost:8080/api/v1/authentication/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
/**
 * Authorization service.
 * Handles user authentication and registration.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  /**
   * Authenticates the user by sending email and password to the backend.
   *
   * @param email The user's email address.
   * @param password The user's password.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}${environment.endpoints.auth.signIn}`, {
      email: email,          // 👈 usa "email" en lugar de "username"
      password: password
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * Registers a new user by sending their information to the backend.
   *
   * @param user Object containing name, email, password, roles and profile picture URL.
   */
  registerUser(user: { name: string; email: string; password: string; roles: string[],profilePicture: string }): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}${environment.endpoints.auth.signUp}`, {
      name: user.name,
      email: user.email,
      password: user.password,
      roles: user.roles,
      profilePicture: user.profilePicture,
    }, httpOptions);
  }
}
