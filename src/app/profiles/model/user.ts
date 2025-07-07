
/**
 * Represents a user in the system.
 */
export class User {
  /** User's unique identifier. */
  id: number;
  /** User's email address. */
  email: string;
  /** User's password. */
  password: string;
  /** Full name of the user. */
  name: string;
  /** URL to the user's profile picture. */
  profilePicture: string;
  /** User settings object (customizable preferences). */
  settings: any;
  /**
   * Optional payment card information associated with the user.
   */
  card?: {
    id: number;
    cardNumber: string;
    holderName: string;
    expirationDate: string;
    cvv: string;
  };

  constructor() {
    this.id = 0;
    this.email = '';
    this.password = '';
    this.name = '';
    this.profilePicture = '';
    this.settings = {};
    this.card = {
      id: 0,
      cardNumber: '',
      holderName: '',
      expirationDate: '',
      cvv: ''
    };
  }
}
