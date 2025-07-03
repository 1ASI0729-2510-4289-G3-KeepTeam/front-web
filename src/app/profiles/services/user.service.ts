import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';
  private baseUrlCard = 'http://localhost:8080/api/v1/payment-cards';
  // 🔁 Cambia a tu backend real

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createUserCard(cardData: any): Observable<any> {
    return this.http.post(`${this.baseUrl.replace('/users', '/payment-cards')}`, cardData);
  }

  updateUserCard(paymentCardId: number, cardData: any): Observable<any> {
    return this.http.put(`${this.baseUrl.replace('/users', '/payment-cards')}/${paymentCardId}`, cardData);
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const url = `http://localhost:8080/api/v1/users/${userId}/change-password`;
    return this.http.patch(url, {
      currentPassword,
      newPassword
    });
  }
}

