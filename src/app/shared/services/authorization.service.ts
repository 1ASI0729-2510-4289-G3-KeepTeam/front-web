import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${environment.fakeAPIBaseUrl}/users`, {
      params: { email, password }
    });
  }

  getUserByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.fakeAPIBaseUrl}/users`, {
      params: { email }
    });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${environment.fakeAPIBaseUrl}/users`, user);
  }

}
