import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {map,switchMap,tap,forkJoin} from 'rxjs';
import { Wish } from '../model/wish.entity';
import {Tag} from '../model/tag.entity';
import {Collection} from '../model/collection.entity';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly baseUrl = environment.fakeAPIBaseUrl;


  constructor(private http: HttpClient) {}
  /**
   * @function getCollections
   * @description Fetch all collections and their items.
   * For each collection, fetch items separately and combine them.
   */
  getCollections() {
    return this.http.get<any[]>(`${this.baseUrl}/collections`).pipe(
      switchMap(collections => {
        const requests = collections.map((collection: any) =>
          this.getProductsByIdCollection(collection.id).pipe(
            map(items => ({
              id: collection.id,
              name: collection.title ?? 'Sin nombre',
              items
            }))
          )
        );
        return forkJoin(requests); // Espera a que todas las peticiones terminen
      })
    );
  }
  /**
   * @function getWishById
   * @description Fetch a single wish by its ID, including tags.
   * @param wishId The ID of the wish to fetch
   */
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
  /**
   * @function updateWish
   * @description Update an existing wish.
   * @param wish Wish object to update
   */
  updateWish(wish: Wish) {
    return this.http.put<Wish>(`${this.baseUrl}/items/${wish.id}`, wish);
  }
  /**
   * @function updateCollectionTitle
   * @description Update the title of a collection by its ID.
   * @param id Collection ID
   * @param newTitle New title string
   */
  updateCollectionTitle(id: string, newTitle: string) {
    return this.http.patch<Collection>(`${this.baseUrl}/collections/${id}`, { title: newTitle });
  }
  /**
   * @function getCollectionById
   * @description Fetch a collection by its ID.
   * @param id Collection ID
   */
  getCollectionById(id: string) {
    return this.http.get<Collection>(`${this.baseUrl}/collections/${id}`);
  }

  /**
   * @function deleteWish
   * @description Delete a wish from de database by its ID.
   * @param id Wish ID
   */
  deleteWish(id: string) {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }
  /**
   * @function getProductsByIdCollection
   * @description Fetch all wishes/items by collection ID.
   * @param idCollection Collection ID
   */
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


