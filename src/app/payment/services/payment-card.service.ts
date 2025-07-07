import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentCard } from '../model/payment-card';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
/**
 * Service for handling CRUD operations related to user payment cards.
 */
@Injectable({ providedIn: 'root' })
export class PaymentCardService {
  /**
   * Base URL for the payment card API endpoints.
   */
  private readonly apiUrl = `${environment.apiBaseUrl}/payment-cards`;

  constructor(private http: HttpClient) {}
  /**
   * Creates a new payment card.
   *
   * @param card - The payment card data to be created.
   * @returns An observable emitting the created `PaymentCard`.
   */
  createCard(card: PaymentCard): Observable<PaymentCard> {
    return this.http.post<PaymentCard>(this.apiUrl, card);
  }
  /**
   * Retrieves all payment cards associated with a specific user.
   *
   * @param userId - The ID of the user whose cards will be fetched.
   * @returns An observable emitting an array of `PaymentCard`.
   */
  getUserCards(userId: number): Observable<PaymentCard[]> {
    return this.http.get<PaymentCard[]>(`${this.apiUrl}/user/${userId}`);
  }
  /**
   * Updates an existing payment card by its ID.
   *
   * @param cardId - The ID of the payment card to update.
   * @param card - The updated payment card data.
   * @returns An observable emitting the updated `PaymentCard`.
   */
  updateCard(cardId: number, card: PaymentCard): Observable<PaymentCard> {
    return this.http.put<PaymentCard>(`${this.apiUrl}/${cardId}`, card);
  }
}
