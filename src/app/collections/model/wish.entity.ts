import { Tag } from './tag.entity';
/**
 * @class Wish
 * @description
 * Represents a wish item that belongs to a collection.
 * Contains properties for identification, description, URLs, and tagging.
 */
export class Wish {
  id: string;
  idCollection: string;
  title: string;
  description: string;
  isInTrash: boolean;
  urlImg: string;
  redirectUrl: string;
  tags: Tag[];

  constructor() {
    this.id = '';
    this.idCollection = '';
    this.title = '';
    this.isInTrash = false;
    this.description = '';
    this.urlImg = '';
    this.redirectUrl = '';
    this.tags = [];
  }
}
