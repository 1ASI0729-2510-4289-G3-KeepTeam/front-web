/**
 * Represents the data required to request a new subscription.
 */
export interface SubscriptionRequest {
  userId: number;
  membershipId: number;
  paymentCardId: number | null;
}
