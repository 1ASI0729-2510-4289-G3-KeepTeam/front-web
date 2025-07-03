import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/v1/authentication/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  // Iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/v1/authentication/sign-in', {
      email: email,          // 👈 usa "email" en lugar de "username"
      password: password
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Registrar usuario
  registerUser(user: { name: string; email: string; password: string; roles: string[],profilePicture: string }): Observable<any> {
    return this.http.post(AUTH_API + 'sign-up', {
      name: user.name,
      email: user.email,
      password: user.password,
      roles: user.roles,
      profilePicture: user.profilePicture,
    }, httpOptions);
  }
}
