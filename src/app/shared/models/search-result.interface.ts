
/**
 * Represents a single search result item.
 */
export interface SearchResult {
  id: number;
  title: string;
  type?: 'collection' | 'wish';
}
