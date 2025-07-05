import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentCard } from '../model/payment-card';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentCardService {
  private readonly apiUrl = `${environment.apiBaseUrl}/payment-cards`;

  constructor(private http: HttpClient) {}

  createCard(card: PaymentCard): Observable<PaymentCard> {
    return this.http.post<PaymentCard>(this.apiUrl, card);
  }

  getUserCards(userId: number): Observable<PaymentCard[]> {
    return this.http.get<PaymentCard[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateCard(cardId: number, card: PaymentCard): Observable<PaymentCard> {
    return this.http.put<PaymentCard>(`${this.apiUrl}/${cardId}`, card);
  }
}
