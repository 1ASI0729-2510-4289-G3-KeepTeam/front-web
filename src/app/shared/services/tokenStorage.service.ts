import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';
const USER_KEY = 'auth-user';
const USER_ID = 'userId';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ID, user.id);
  }


  public getUserId(): any {
    return localStorage.getItem(USER_ID);
  }


}
