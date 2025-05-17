export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  settings: any;
  card?: {
    cardNumber: string;
    holder: string;
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
      cardNumber: '',
      holder: '',
      expirationDate: '',
      cvv: ''
    };
  }
}
