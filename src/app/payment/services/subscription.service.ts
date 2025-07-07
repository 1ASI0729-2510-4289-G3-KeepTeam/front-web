import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubscriptionRequest } from '../model/subscription-request';
import {environment} from '../../../environments/environment';
/**
 * Service for managing user subscriptions.
 * Handles creation, retrieval, and upgrading of subscription plans.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  /**
   * Base URL for the subscription-related API endpoints.
   */
  private readonly apiUrl = `${environment.apiBaseUrl}/subscriptions`;

  constructor(private http: HttpClient) {}
  /**
   * Creates a new subscription for a user.
   *
   * @param request - The subscription request containing userId, membershipId, and paymentCardId.
   * @returns An observable emitting the created subscription or server response.
   */
  createSubscription(request: SubscriptionRequest) {
    return this.http.post(this.apiUrl, request);
  }
  /**
   * Retrieves the current subscription of a specific user.
   *
   * @param userId - The ID of the user.
   * @returns An observable emitting the subscription details.
   */
  getUserSubscription(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
  /**
   * Upgrades an existing subscription to a different membership plan.
   *
   * @param subscriptionId - The ID of the current subscription to be upgraded.
   * @param request - The request containing userId, new membershipId, and paymentCardId.
   * @returns An observable emitting the updated subscription or server response.
   */
  upgradePlan(subscriptionId: number, request: { userId: number; membershipId: number; paymentCardId: number }) {
    return this.http.put(`${this.apiUrl}/${subscriptionId}`, request);
  }


}
