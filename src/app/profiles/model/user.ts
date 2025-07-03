export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  settings: any;
  card?: {
    id: number;
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
      id: 0,
      cardNumber: '',
      holder: '',
      expirationDate: '',
      cvv: ''
    };
  }
}
