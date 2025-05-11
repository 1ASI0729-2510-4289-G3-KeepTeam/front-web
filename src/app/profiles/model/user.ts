export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  settings: any;

  constructor() {
    this.id = 0;
    this.email = '';
    this.password = '';
    this.name = '';
    this.profilePicture = '';
    this.settings = {};
  }
}
