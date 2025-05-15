import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {map, tap} from 'rxjs';
import { Collection } from '../model/collection.entity';
import { Wish } from '../model/wish.entity';
import {Tag} from '../model/tag.entity';

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

  getWishById(wishId: string) {
    console.log(`${this.baseUrl}/items?id=${wishId}`);
    return this.http.get(`${this.baseUrl}/items?id=${wishId}`).pipe(
      map((response: any): Wish => {
        console.log('Respuesta de la API:', response);
        // Aseguramos que accedemos al primer objeto de la respuesta
        const wishData = response[0];  // Primero accedemos al primer objeto del arreglo
        const wish = new Wish();

        // Asignamos los datos del objeto a las propiedades del wish
        wish.id = wishData.id;
        wish.idCollection = wishData.idCollection;  // Asegúrate de usar el nombre correcto
        wish.title = wishData.title;
        wish.description = wishData.description;
        wish.urlImg = wishData.urlImg;
        wish.redirectUrl = wishData.redirectUrl;

        // Aquí es donde necesitamos acceder a los tags correctamente
        // Asegurándonos de que existan tags antes de intentar acceder a ellos
        wish.tags = (wishData.tags || []).map((tag: any) => {
          const tagInstance = new Tag();
          tagInstance.name = tag.name;
          tagInstance.color = tag.color;
          return tagInstance;
        });

        return wish;
      })
    );
  }

  updateWish(wish: Wish) {
    return this.http.put<Wish>(`${this.baseUrl}/items/${wish.id}`, wish);
  }

  deleteWish(id: string) {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }

  getProductsByIdCollection(idCollection: string) {
    console.log(`${this.baseUrl}/items?idCollection=${idCollection}`, "me vuelvo loco");
    return this.http
      .get<any[]>(`${this.baseUrl}/items?idCollection=${idCollection}`)
      .pipe(
        tap((response: any) => {
          console.log('Respuesta de la API:', response); // Asegúrate de ver la respuesta aquí
        }),
        map((response): Wish[] => {
          if (!response || !Array.isArray(response)) {
            console.error('La respuesta no es un array válido:', response);
            return []; // Retorna un array vacío si no es válido
          }

          return response.map((item) => {
            const wish = new Wish();
            wish.id = item.id;
            wish.idCollection = item.idCollection;
            wish.title = item.title;
            wish.description = item.description;
            wish.urlImg = item.urlImg;
            wish.isInTrash =  Boolean(item.isInTrash);
            wish.redirectUrl = item.redirectUrl;
            wish.tags = (item.tags ?? []).map((tag: any) => {
              const tagInstance = new Tag();
              tagInstance.name = tag.name;
              tagInstance.color = tag.color;
              return tagInstance;
            });
            return wish;
          });
        })
      );
}}


