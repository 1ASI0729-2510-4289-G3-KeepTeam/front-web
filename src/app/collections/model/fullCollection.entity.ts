
import {Collection} from './collection.entity';

/**
 * @class FullCollection
 * @description
 * Represents a collection of wishes. Each collection has a unique identifier, name and wish array
 */

export class FullCollection extends Collection {
  imageUrls: string[];
  tags: { name: string; color: string }[];

  constructor() {
    super();
    this.imageUrls = [];
    this.tags = [];
  }
}
