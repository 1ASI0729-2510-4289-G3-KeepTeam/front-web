import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';
const USER_KEY = 'auth-user';
const USER_ID = 'userId';
/**
 * Token storage service.
 * Manages saving and retrieving authentication tokens and user information from local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    localStorage.clear();
  }
  /**
   * Saves the authentication token in local storage.
   *
   * @param token The JWT token to store.
   */
  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }
  /**
   * Retrieves the authentication token from local storage.
   */
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  /**
   * Saves the authenticated user object and ID in local storage.
   *
   * @param user The user object to store.
   */
  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ID, user.id);
  }

  /**
   * Retrieves the user ID from local storage.
   */
  public getUserId(): any {
    return localStorage.getItem(USER_ID);
  }


}
