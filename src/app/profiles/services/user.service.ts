import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import { PaymentCard } from '../../payment/model/payment-card';
/**
 * Service responsible for handling operations related to user accounts and user payment cards.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Base URL for user-related API endpoints.
   */
  private usersUrl = `${environment.apiBaseUrl}${environment.endpoints.users}`;

  /**
   * Base URL for payment card-related API endpoints.
   */
  private cardsUrl = `${environment.apiBaseUrl}${environment.endpoints.paymentCards}`;

  constructor(private http: HttpClient) {}
  /**
   * Fetches a user by their unique ID.
   *
   * @param id The user's ID.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }
  /**
   * Updates the user's name, email, and profile picture.
   *
   * @param user The user object with updated values.
   */
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${user.id}`, {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
  }
  /**
   * Deletes a user account by ID.
   *
   * @param id The ID of the user to delete.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${id}`);
  }
  /**
   * Creates a new payment card associated with the user.
   *
   * @param cardData Data for the new payment card.
   */
  createUserCard(cardData: any): Observable<any> {
    return this.http.post(`${this.cardsUrl}`, cardData);
  }
  /**
   * Retrieves all payment cards associated with a given user ID.
   *
   * @param userId The user's ID.
   */
  getCardsByUserId(userId: number): Observable<PaymentCard[]> {
    return this.http.get<PaymentCard[]>(`${this.cardsUrl}/user/${userId}`);
  }

  /**
   * Updates a user's payment card by its ID.
   *
   * @param paymentCardId The ID of the payment card to update.
   * @param cardData The updated card data.
   */
  updateUserCard(paymentCardId: number, cardData: any): Observable<any> {
    return this.http.put(`${this.cardsUrl}/${paymentCardId}`, cardData);
  }
  /**
   * Changes the user's password by providing the current and new passwords.
   *
   * @param userId The ID of the user.
   * @param currentPassword The user's current password.
   * @param newPassword The new password to set.
   */
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.changePassword(userId)}`;
    return this.http.patch(url, {
      currentPassword,
      newPassword
    });
  }
}

