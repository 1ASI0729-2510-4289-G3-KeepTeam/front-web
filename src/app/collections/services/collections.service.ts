import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {map, switchMap, forkJoin, Observable, of, tap} from 'rxjs';
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
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  /**
   * @function getCollections
   * @description Fetch all collections belonging to the current user.
   * @returns {Observable<Collection[]>} An observable array of Collection entities.
   */
  getCollections() {
    return this.http.get<Collection[]>(`${this.baseUrl}/collections/user/${localStorage.getItem("userId")}`).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response))
    )
  }


  /**
   * @Function getUniqueTags
   * @description Extracts up to 3 unique tags from a list of wishes, ignoring those in trash.
   * @param {Wish[]} wishes - Array of Wish objects.
   * @returns {{ name: string; color: string }[]} An array of unique tags with their names and colors.
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
   * @returns {Observable<FullCollection[]>} An observable array of FullCollection entities.
   */

  getFullCollections() {
    return this.transformToFullCollection(this.getCollections());
  }

  /**
   * @function getSubCollectionsByParentId
   * @description Fetches sub-collections belonging to a specific parent collection ID.
   * @param {number} parentId The ID of the parent collection.
   * @returns {Observable<FullCollection[]>} An observable array of FullCollection entities representing sub-collections.
   */
  getSubCollectionsByParentId(parentId: number): Observable<FullCollection[]> {
    return this.http.get<FullCollection[]>(`${this.baseUrl}/collections/parentCollection/${parentId}`);
  }

  /**
   * @function getWishById
   * @description Fetch a single wish by its ID, including tags.
   * @param {number} wishId The ID of the wish to fetch.
   * @returns {Observable<Wish>} An observable of the Wish entity.
   */
  getWishById(wishId: number) {
    console.log(`${this.baseUrl}/wishes/${wishId}`);
    return this.http.get(`${this.baseUrl}/wishes/${wishId}`).pipe(
      map((response: any): Wish => {
        console.log('Respuesta de la API:', response);
        const wishData = response;
        const wish = new Wish();

        wish.id = wishId;
        wish.collectionId = wishData.collectionId  ?? 1;
        wish.title = wishData.title;
        wish.description = wishData.description;
        wish.urlImg = wishData.urlImg;
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
   * @description Update an existing wish and its associated tags.
   * @param {Wish} wish Wish object to update.
   * @returns {Observable<any>} An observable indicating the completion of the update operation.
   */

  updateWish(wish: Wish) {

    const tagsBody = wish.tags.map(tag => ({
      name: tag.name,
      color: tag.color
    }));

    return this.http.put(`${this.baseUrl}/wishes/${wish.id}`, wish).pipe(
      switchMap(() => this.http.post(`${this.baseUrl}/wishes/${wish.id}/tags`, tagsBody))
    );
  }
  /**
   * @function updateCollection
   * @description Update an existing collection.
   * @param {Collection} col Collection object to update. This method now handles updating all relevant fields.
   * @returns {Observable<Collection>} An observable of the updated Collection entity.
   */
  updateCollection(col: Collection): Observable<Collection> {
    return this.http.put<Collection>(`${this.baseUrl}/collections/${col.id}`, col);
  }

  /**
   * @function createCollection
   * @description Create a new collection.
   * @param {Collection} collection Collection object to create.
   * @returns {Observable<Collection>} An observable of the newly created Collection entity.
   */
  createCollection(collection: Collection): Observable<Collection> {
    const collectionDataToSend = {
      title: collection.title,
      idUser: collection.idUser,
      isInTrash: collection.isInTrash,
      idParentCollection: collection.idParentCollection,
    };
    return this.http.post<Collection>(`${this.baseUrl}/collections`, collectionDataToSend);
  }

  /**
   * @function getCollectionById
   * @description Fetch a collection by its ID.
   * @param {number} id Collection ID.
   * @returns {Observable<Collection>} An observable of the Collection entity.
   */
  getCollectionById(id: number) {
    return this.http.get<Collection>(`${this.baseUrl}/collections/${id}`);
  }
  /**
   * @function createWish
   * @description Create a new Wish.
   * @param {Wish} wish The Wish object to create.
   * @returns {Observable<any>} An observable indicating the completion of the creation operation.
   */
  createWish(wish: Wish) {
    return this.http.post(`${this.baseUrl}/wishes`, wish);
  }

  /**
   * @function deleteWish
   * @description Delete a wish from the database by its ID.
   * @param {number} id Wish ID.
   * @returns {Observable<any>} An observable indicating the completion of the deletion operation.
   */
  deleteWish(id: number) {
    return this.http.delete(`${this.baseUrl}/wishes/${id}`);
  }

  /**
   * @function deleteCollection
   * @description Delete a collection from the database by its ID.
   * @param {number} id Collection ID.
   * @returns {Observable<any>} An observable indicating the completion of the deletion operation.
   */
  deleteCollection(id: number) {
    return this.http.delete(`${this.baseUrl}/collections/${id}`);
  }
  /**
   * @function getProductsByIdCollection
   * @description Fetch all wishes/items by collection ID.
   * @param {number} idCollection Collection ID.
   * @returns {Observable<Wish[]>} An observable array of Wish entities belonging to the specified collection.
   */
  getProductsByIdCollection(idCollection: number): Observable<Wish[]> {
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
            wish.collectionId = item.collectionId;
            wish.title = item.title;
            wish.description = item.description;
            wish.urlImg = item.urlImg;
            wish.isInTrash =  Boolean(item.isInTrash) ?? false;
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
   * @function getSubCollectionsFromCollection
   * @description Fetches and transforms sub-collections of a given collection into FullCollection objects.
   * @param {number} idCollection The ID of the parent collection.
   * @returns {Observable<FullCollection[]>} An observable array of FullCollection entities representing sub-collections.
   */
  getSubCollectionsFromCollection(idCollection: number){
    const subCollections = this.http.get<Collection[]>(`${this.baseUrl}/collections/parentCollection/${idCollection}`).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response))
    )
    return this.transformToFullCollection(subCollections);
  }


  /**
   * @function transformToFullCollection
   * @description Transforms an observable of collections into an observable of FullCollection objects,
   * enriching each with image URLs and unique tags from its associated wishes.
   * @param {Observable<Collection[]>} fullCollectionRequests An observable array of Collection entities.
   * @returns {Observable<FullCollection[]>} An observable array of FullCollection entities.
   */
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
   * @function getTrashedItemsByCollectionId
   * @description Fetch all trashed wishes (isInTrash = true) belonging to a specific collection.
   * @param {number} collectionId Collection ID.
   * @returns {Observable<Wish[]>} An observable array of trashed Wish entities.
   */
  getTrashedItemsByCollectionId(collectionId: number) {
    return this.http
      .get<any[]>(`${this.baseUrl}/wishes/collection/${collectionId}`)
      .pipe(
        map((response): Wish[] => {
          console.log(response);
          if (!response || !Array.isArray(response)) {
            console.error('La respuesta no es un array válido:', response);
            return [];
          }
          return response
            .map((item) => {
              console.log(response);
              const wish = new Wish();
              wish.id = item.id;
              wish.collectionId = item.idCollection;
              wish.title = item.title;
              wish.description = item.description;
              wish.urlImg = item.urlImg;
              wish.isInTrash = Boolean(item.isInTrash);
              wish.redirectUrl = item.redirectUrl;
              wish.tags = (item.tags ?? []).map((tag: any) => {
                const tagInstance = new Tag();
                tagInstance.name = tag.name;
                tagInstance.color = tag.color;
                return tagInstance;
              });
              return wish;
            })
            .filter(wish => wish.isInTrash);
        })
      );
  }

  /**
   * @function searchCollections
   * @description Searches for collections by title and maps them to SearchResult type,
   * EXCLUDING trashed collections AND subcollections.
   * Ensures only top-level (idParentCollection=0) and non-trashed collections are returned.
   * @param {string} query The search string.
   * @returns {Observable<SearchResult[]>} An observable array of SearchResult entities representing collections.
   */
  searchCollections(query: string): Observable<SearchResult[]> {
    return this.http.get<Collection[]>(`${this.baseUrl}/collections/user/${localStorage.getItem("userId")}`).pipe(
      map(response => CollectionAssembler.toEntitiesFromResponse(response)),
      map(collections =>
        collections
          .filter(col =>
            col.idParentCollection === 0 &&
            !col.isInTrash &&
            col.title.toLowerCase().includes(query.trim().toLowerCase())
          )
          .map(col => ({ id: col.id, title: col.title, type: 'collection' } as SearchResult))
      )
    );
  }

  /**
   * @function searchItems
   * @description Searches for wishes/items by title within a specific collection and maps them to SearchResult type,
   * EXCLUDING trashed items. This search SHOULD include subcollections if they are considered "items"
   * within the parent collection.
   * @param {string} query The search string.
   * @param {number} collectionId The ID of the collection to search within.
   * @returns {Observable<SearchResult[]>} An observable array of SearchResult entities representing wishes and sub-collections.
   */
  searchItems(query: string, collectionId: number): Observable<SearchResult[]> {
    const allWishesUrl = `${this.baseUrl}/wishes/collection/${collectionId}`;

    return this.http.get<any[]>(allWishesUrl).pipe(
      tap(response => console.log('🔍 raw response:', response)), // <-- Aquí ves la data real
      map(response => {
        return response.map(item => {
          const wish = new Wish();
          wish.id = item.id;
          wish.collectionId = collectionId;
          wish.title = item.title;
          wish.description = item.description;
          wish.urlImg = item.urlImg;
          wish.isInTrash = Boolean(item.isInTrash);
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
      map(wishes =>
        wishes.filter(wish =>
          wish.collectionId === collectionId &&
          !wish.isInTrash &&
          wish.title.toLowerCase().includes(query.trim().toLowerCase())
        )
      ),
      map(wishes =>
        wishes.map(wish => ({
          id: wish.id,
          title: wish.title,
          type: 'wish'
        } as SearchResult))
      ),
    );
  }}
