import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly baseUrl = environment.fakeAPIBaseUrl;
  private readonly endpoint = 'collections';

  constructor(private http: HttpClient) {}

  getCollections() {
    return this.http.get(`${this.baseUrl}/${this.endpoint}`);
  }
}
