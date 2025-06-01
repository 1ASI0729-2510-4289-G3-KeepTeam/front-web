import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {map, switchMap, forkJoin, Observable} from 'rxjs';
import { Wish } from '../model/wish.entity';
import {Tag} from '../model/tag.entity';
import {Collection} from '../model/collection.entity';
import {CollectionAssembler} from './collection.assembler';
import {FullCollection} from '../model/fullCollection.entity';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly baseUrl = environment.fakeAPIBaseUrl;


  constructor(private http: HttpClient) {}
  /**
   * @function getCollections
   * @description Fetch all collections.
   */
  getCollections() {
    return this.http.get<Collection[]>(`${this.baseUrl}/collections`).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response))
    )
  }

  /**
   * @Function getUniqueTags
   * @description Extracts up to 3 unique tags from a list of wishes, ignoring those in trash.
   * @param {Array} wishes - Array of Wish objects.
   */

  getUniqueTags(wishes: Wish[]): { name: string; color: string }[] {
    const uniqueTagsMap: { [key: string]: { name: string; color: string } } = {};

    for (const wish of wishes) {
      if (!wish.tags || wish.isInTrash) continue;
      for (const tag of wish.tags) {
        if (!uniqueTagsMap[tag.name]) {
          uniqueTagsMap[tag.name] = { name: tag.name, color: tag.color || '#e0f7fa' };
        }
        if (Object.keys(uniqueTagsMap).length >= 3) break;
      }
      if (Object.keys(uniqueTagsMap).length >= 3) break;
    }

    return Object.values(uniqueTagsMap);
  }

  /**
   * @Function getFullCollections
   * @description Fetches collections and enriches each with up to 4 image URLs and up to 3 unique tags.
   */

  getFullCollections() {
    return this.transformToFullCollection(this.getCollections())
  }

  getSubCollectionsByParentId(parentId: number): Observable<FullCollection[]> {
    return this.http.get<FullCollection[]>(`${this.baseUrl}/collections?idParentCollection=${parentId}`);
  }

  /**
   * @function getWishById
   * @description Fetch a single wish by its ID, including tags.
   * @param wishId The ID of the wish to fetch
   */
  getWishById(wishId: number) {
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
   * @function updateCollection
   * @description Update an existing wish.
   * @param col Wish object to update
   */
  updateCollection(col: Collection) {
    return this.http.put<Collection>(`${this.baseUrl}/collections/${col.id}`, col);
  }
  /**
   * @function updateCollectionTitle
   * @description Update the title of a collection by its ID.
   * @param id Collection ID
   * @param newTitle New title string
   */
  updateCollectionTitle(id: number, newTitle: string) {
    return this.http.patch<Collection>(`${this.baseUrl}/collections/${id}`, { title: newTitle });
  }
  /**
   * @function getCollectionById
   * @description Fetch a collection by its ID.
   * @param id Collection ID
   */
  getCollectionById(id: number) {
    return this.http.get<Collection>(`${this.baseUrl}/collections/${id}`);
  }
  /**
   * @function deleteWish
   * @description Create a new Wish
   */
  createWish(wish: Wish) {
    return this.http.post(`${this.baseUrl}/items`, wish);
  }

  /**
   * @function deleteWish
   * @description Delete a wish from de database by its ID.
   * @param id Wish ID
   */
  deleteWish(id: number) {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }

  /**
   * @function deleteCollection
   * @description Delete a wish from de database by its ID.
   * @param id Wish ID
   */
  deleteCollection(id: number) {
    return this.http.delete(`${this.baseUrl}/collections/${id}`);
  }
  /**
   * @function getProductsByIdCollection
   * @description Fetch all wishes/items by collection ID.
   * @param idCollection Collection ID
   */
  getProductsByIdCollection(idCollection: number) {
    return this.http
      .get<any[]>(`${this.baseUrl}/items?idCollection=${idCollection}`)
      .pipe(
        map((response): Wish[] => {
          if (!response || !Array.isArray(response)) {
            console.error('La respuesta no es un array válido:', response);
            return [];
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
}

  getSubCollectionsFromCollection(idCollection: number){
    const subCollections = this.http.get<Collection[]>(`${this.baseUrl}/collections?idParentCollection=${idCollection}`).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response))
    )
    return this.transformToFullCollection(subCollections);
  }

  transformToFullCollection(fullCollectionRequests: Observable<Collection[]>): Observable<FullCollection[]> {
    return fullCollectionRequests.pipe(
      switchMap((collections: Collection[]) => {
        const fullCollectionRequests = collections.map(collection =>
          this.getProductsByIdCollection(collection.id).pipe(
            map((wishes: Wish[]) => {
              const imageUrls = wishes
                .filter(w => !w.isInTrash)
                .slice(0, 4)
                .map(w => w.urlImg);

              const tags = this.getUniqueTags(wishes);

              return {
                ...collection,
                imageUrls,
                tags
              } as FullCollection;
            })
          )
        );

        return forkJoin(fullCollectionRequests);
      })
    );
  }
  /**
   * @function getTrashedCollections
   * @description Fetch all isInTrash collections.
   */
  getTrashedCollections() {
    return this.http.get<Collection[]>(`${this.baseUrl}/collections?isInTrash=true`).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response))
    )
  }

  /**
   * @function getTrashedItems
   * @description Fetch all isInTrash Items.
   */
  getTrashedItems() {
      return this.http
        .get<any[]>(`${this.baseUrl}/items?isInTrash=true`)
        .pipe(
          map((response): Wish[] => {
            console.log(response);
            if (!response || !Array.isArray(response)) {
              console.error('La respuesta no es un array válido:', response);
              return [];
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
    }
}


