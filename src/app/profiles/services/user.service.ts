import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://db-json-server-keeplo-10di.onrender.com/api/v1/users';

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateUserCard(id: number, cardData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, { card: cardData });
  }

  changePassword(id: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, { password: newPassword });

  }

}
