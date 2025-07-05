import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Membership } from '../model/membership';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = `${environment.apiBaseUrl}/memberships`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Membership[]> {
    return this.http.get<Membership[]>(this.apiUrl);
  }


}
