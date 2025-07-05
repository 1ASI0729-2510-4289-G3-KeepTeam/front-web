import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubscriptionRequest } from '../model/subscription-request';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  createSubscription(request: SubscriptionRequest) {
    return this.http.post(this.apiUrl, request);
  }

  getUserSubscription(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}
