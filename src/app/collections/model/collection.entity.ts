import { Wish } from './wish.entity';

/**
 * @class Collection
 * @description
 * Represents a collection of wishes. Each collection has a unique identifier, name
 */

export class Collection {
  id = '';
  name = '';
  items: Wish[] = [];
}
