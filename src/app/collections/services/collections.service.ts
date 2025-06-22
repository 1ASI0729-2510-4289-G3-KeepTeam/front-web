// src/app/collections/services/collections.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {map, switchMap, forkJoin, Observable, of} from 'rxjs';
import { Wish } from '../model/wish.entity';
import {Tag} from '../model/tag.entity';
import {Collection} from '../model/collection.entity';
import {CollectionAssembler} from './collection.assembler';
import {FullCollection} from '../model/fullCollection.entity';
import { SearchResult } from '../../shared/models/search-result.interface';


@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly baseUrl = environment.APIBaseUrl;


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
    return this.transformToFullCollection(this.getCollections());
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
    console.log(`${this.baseUrl}/wishes/${wishId}`);
    return this.http.get(`${this.baseUrl}/wishes/${wishId}`).pipe(
      map((response: any): Wish => {
        console.log('Respuesta de la API:', response);
        const wishData = response;
        const wish = new Wish();

        wish.id = wishId;
        wish.idCollection = wishData.collectionId  ?? 1;
        wish.title = wishData.title;
        wish.description = wishData.description;
        wish.urlImg = wishData.url;
        wish.redirectUrl = wishData.redirectUrl ?? null;

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
    return this.http.put<Wish>(`${this.baseUrl}/wishes/${wish.id}`, wish);
  }

  /**
   * @function updateCollection
   * @description Update an existing collection.
   * @param col Collection object to update. This method now handles updating all relevant fields.
   */
  updateCollection(col: Collection): Observable<Collection> {
    return this.http.put<Collection>(`${this.baseUrl}/collections/${col.id}`, col);
  }

  /**
   * @function createCollection
   * @description Create a new collection.
   * @param collection Collection object to create.
   */
  createCollection(collection: Collection): Observable<Collection> {
    const collectionDataToSend = {
      title: collection.title,
      idUser: collection.idUser,
      isInTrash: collection.isInTrash,
      idParentCollection: collection.idParentCollection,
      color: collection.color
    };
    return this.http.post<Collection>(`${this.baseUrl}/collections`, collectionDataToSend);
  }


  /**
   * @function updateCollectionTitle
   * @description Update the title of a collection by its ID. (Puede que ya no sea necesaria si updateCollection es más genérico)
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
    return this.http.post(`${this.baseUrl}/wishes`, wish);
  }

  /**
   * @function deleteWish
   * @description Delete a wish from de database by its ID.
   * @param id Wish ID
   */
  deleteWish(id: number) {
    return this.http.delete(`${this.baseUrl}/wishes/${id}`);
  }

  /**
   * @function deleteCollection
   * @description Delete a collection from the database by its ID.
   * @param id Collection ID
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
      .get<any[]>(`${this.baseUrl}/wishes/collection/${idCollection}`)
      .pipe(
        map((response): Wish[] => {
          if (!response || !Array.isArray(response)) {
            console.error('La respuesta no es un array válido:', response);
            return [];
          }

          return response.map((item) => {
            const wish = new Wish();
            wish.id = item.id;
            wish.idCollection = item.collectionId;
            wish.title = item.title;
            wish.description = item.description;
            wish.urlImg = item.url;
            wish.isInTrash =  Boolean(item.isInTrash) ?? false;
            wish.redirectUrl = item.url;
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
      .get<any[]>(`${this.baseUrl}/wishes?isInTrash=true`)
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

  /**
   * @function searchCollections
   * @description Searches for collections by title and maps them to SearchResult type, EXCLUDING trashed collections AND subcollections.
   * @param query The search string.
   * @returns Observable of SearchResult array.
   */
  searchCollections(query: string): Observable<SearchResult[]> {
    const url = `${this.baseUrl}/collections?title_like=${query}&isInTrash=false&idParentCollection=0`; // <-- ¡NUEVO FILTRO!
    if (!query.trim()) {
      return this.getFullCollections().pipe(

        map(cols => cols.filter(c => c.idParentCollection === 0 && !c.isInTrash)),
        map(cols => cols.map(col => ({ id: col.id, title: col.title, type: 'collection' } as SearchResult)))
      );
    }
    return this.http.get<Collection[]>(url).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response)),
      map(collections => collections.map(col => ({ id: col.id, title: col.title, type: 'collection' } as SearchResult)))
    );
  }

  /**
   * @function searchItems
   * @description Searches for wishes/items by title within a specific collection and maps them to SearchResult type, EXCLUDING trashed items.
   * This search SHOULD include subcollections if they are considered "items" within the parent collection.
   * @param query The search string.
   * @param collectionId The ID of the collection to search within.
   * @returns Observable of SearchResult array.
   */
  searchItems(query: string, collectionId: number): Observable<SearchResult[]> {

    const wishSearchUrl = `${this.baseUrl}/items?idCollection=${collectionId}&title_like=${query}&isInTrash=false`;
    const wishes$: Observable<SearchResult[]> = this.http.get<Wish[]>(wishSearchUrl).pipe(
      map((response): Wish[] => {
        if (!response || !Array.isArray(response)) {
          console.error('La respuesta de items no es un array válido:', response);
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
      }),
      map(wishes => wishes.map(wish => ({ id: wish.id, title: wish.title, type: 'wish' } as SearchResult)))
    );

    const subCollectionSearchUrl = `${this.baseUrl}/collections?idParentCollection=${collectionId}&title_like=${query}&isInTrash=false`;
    const subCollections$: Observable<SearchResult[]> = this.http.get<Collection[]>(subCollectionSearchUrl).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response)),
      map(subCollections => subCollections.map(subCol => ({ id: subCol.id, title: subCol.title, type: 'collection' } as SearchResult)))
    );

    if (!query.trim()) {
      return forkJoin([
        this.getProductsByIdCollection(collectionId).pipe(
          map(wishes => wishes.filter(wish => !wish.isInTrash)),
          map(wishes => wishes.map(wish => ({ id: wish.id, title: wish.title, type: 'wish' } as SearchResult)))
        ),
        this.getSubCollectionsFromCollection(collectionId).pipe(
          map(cols => cols.filter(c => !c.isInTrash)), // Filtro por si acaso
          map(subCols => subCols.map(subCol => ({ id: subCol.id, title: subCol.title, type: 'collection' } as SearchResult)))
        )
      ]).pipe(map(([wishes, subCollections]) => [...wishes, ...subCollections]));
    }

    return forkJoin([wishes$, subCollections$]).pipe(
      map(([wishes, subCollections]) => [...wishes, ...subCollections])
    );
  }
}
