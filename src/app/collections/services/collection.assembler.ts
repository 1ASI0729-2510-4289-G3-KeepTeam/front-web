import {Collection} from '../model/collection.entity';
/**
 * @class CollectionAssembler
 * @description Provides static methods to convert Collection resources into entity objects.
 */
export class CollectionAssembler {

  /**
   * @function toEntityFromResource
   * @param {Collection} collection - A Collection resource object.
   * @description Maps a Collection resource to a simpler entity representation.
   */
  static toEntityFromResource(collection: Collection) {
    return {
      id: collection.id,
      title: collection.title,
      idUser: collection.idUser,
      isInTrash: collection.isInTrash,
      idParentCollection: collection.idParentCollection,
    };
  }

  /**
   * @function toEntitiesFromResponse
   * @param {Collection[]} response - Array of Collection resource objects.
   * @description Maps an array of Collection resources to an array of entity objects using toEntityFromResource.
   */
  static toEntitiesFromResponse(response: Collection[]) {
    return response.map(col => this.toEntityFromResource(col));
  }

}
