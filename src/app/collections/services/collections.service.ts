import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { Collection } from '../model/collection.entity';
import { Wish } from '../model/wish.entity';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly baseUrl = environment.fakeAPIBaseUrl;
  private readonly endpoint = 'collections';

  constructor(private http: HttpClient) {}

  getCollections() {
    return this.http.get(`${this.baseUrl}/${this.endpoint}`).pipe(
      map((response: any): Collection[] => {
        return (response as any[]).map((item) => {
          return {
            id: item.id,
            name: item.name,
            items: item.items,
          };
        });
      })
    );
  }

  getProductsByCollectionId(collectionId: string) {
    return this.http
      .get(`${this.baseUrl}/${this.endpoint}/${collectionId}`)
      .pipe(
        map((response: any): Wish[] => {
          return (response.items as any[]).map((item: any) => {
            return {
              id: item.id,
              title: item.title,
              description: item.description,
              imgUrl: item.url,
              tags: item.tags,
              url: item.url,
            };
          });
        })
      );
  }
}
