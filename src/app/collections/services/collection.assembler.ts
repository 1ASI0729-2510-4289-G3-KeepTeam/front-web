import {Collection} from '../model/collection.entity';
/**
 * @class CollectionAssembler
 * @description Provides static methods to convert Collection resources into entity objects.
 */
export class CollectionAssembler {

  /**
   * @function toEntityFromResource
   * @param {any} resource - A collection resource object from the API.
   * @description Maps a collection resource to a simpler entity representation.
   */

  static toEntityFromResource(resource: any): Collection {
    const collection = new Collection();
    collection.id = resource.id;
    collection.title = resource.title;
    collection.idUser = resource.idUser ?? null;
    collection.isInTrash = resource.isPublic;
    collection.idParentCollection = resource.idParentCollection;
    collection.color = resource.color ?? null;
    return collection;
  }

  /**
   * @function toEntitiesFromResponse
   * @param {any[]} response - Array of collection resource objects from the API.
   * @description Maps an array of collection resources to an array of entity objects using toEntityFromResource.
   */
  static toEntitiesFromResponse(response: any[]): Collection[] {
    return response.map(res => this.toEntityFromResource(res));
  }

}
