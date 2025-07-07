
/**
 * Represents a user's payment card used for subscriptions or purchases.
 */
export interface PaymentCard {
  id: number;
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  cvv: string;
  userId: number;
}
