import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import { PaymentCard } from '../../payment/model/payment-card';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = `${environment.apiBaseUrl}${environment.endpoints.users}`;
  private cardsUrl = `${environment.apiBaseUrl}${environment.endpoints.paymentCards}`;

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${user.id}`, {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${id}`);
  }

  createUserCard(cardData: any): Observable<any> {
    return this.http.post(`${this.cardsUrl}`, cardData);
  }

  getCardsByUserId(userId: number): Observable<PaymentCard[]> {
    return this.http.get<PaymentCard[]>(`${this.cardsUrl}/user/${userId}`);
  }


  updateUserCard(paymentCardId: number, cardData: any): Observable<any> {
    return this.http.put(`${this.cardsUrl}/${paymentCardId}`, cardData);
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.changePassword(userId)}`;
    return this.http.patch(url, {
      currentPassword,
      newPassword
    });
  }
}

