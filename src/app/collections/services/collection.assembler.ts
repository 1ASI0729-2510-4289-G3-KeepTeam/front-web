import {Collection} from '../model/collection.entity';

export class CollectionAssembler {

  static toEntityFromResource(collection: Collection) {
    return {
      id: collection.id,
      title: collection.title,
      idUser: collection.idUser,
      isInTrash: collection.isInTrash
    };
  }

  static toEntitiesFromResponse(response: Collection[]) {
    return response.map(col => this.toEntityFromResource(col));
  }

}
