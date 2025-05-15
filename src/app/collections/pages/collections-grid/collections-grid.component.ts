import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';
import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';
import { NgForOf} from '@angular/common';
import { CollectionsService } from '../../services/collections.service';
import { Collection } from '../../model/collection.entity';
import { Wish } from '../../model/wish.entity';
import { Router } from '@angular/router';
/**
 * @component CollectionsGridComponent
 * @description
 * Displays a grid of collection cards.
 * Loads collections with their associated wishes and allows operations like view, edit, share, and delete.
 */
@Component({
  selector: 'app-collections-grid',
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent,
    CollectionCardComponent,
    NgForOf,
  ],
  templateUrl: './collections-grid.component.html',
  styleUrl: './collections-grid.component.css',
})
export class CollectionsGridComponent implements OnInit {
  /**
   * @property collections
   * @description List of collections with basic details and associated items.
   */
  collections: { id: string; name: string; items: Wish[] }[] = [];

  /**
   * @constructor
   * @param collectionsService - Service to fetch collections data.
   * @param router - Angular Router for navigation.
   */
  constructor(private collectionsService: CollectionsService, private router: Router) {}

  /**
   * @function ngOnInit
   * @description Lifecycle hook that triggers loading of collections when component initializes.
   */
  ngOnInit(){
    this.loadCollections();
  }

  /**
   * @function loadCollections
   * @description Fetches collections from the service and maps them to the local collections array.
   */
  loadCollections(){
    this.collectionsService.getCollections().subscribe({
      next: (data: Collection[]) => {
        this.collections = data.map(collection => ({
          id: collection.id,
          name: collection.name,
          items: collection.items,
        }));
      },
      error: (error) => {
        console.error('Error loading collections:', error);
      }
    });

    console.log(this.collections);
  }

  /**
   * @function extractFirstFourImages
   * @description Extracts the first four image URLs from a list of wishes.
   * @param items - Array of Wish objects.
   * @returns {string[]} Array of image URLs.
   */
  extractFirstFourImages(items: Wish[]){
    if (!items) return [];
    return items.filter(wish => !wish.isInTrash).slice(0, 4).map(wish => wish.urlImg);
  }

  /**
   * @function extractFirstUniqueTags
   * @description Extracts up to the first three unique tags from a list of wishes.
   * @param items - Array of Wish objects.
   * @returns {{ name: string; color: string }[]} Array of unique tag objects.
   */
  extractFirstUniqueTags(items: Wish[]){
    if (!items) return [];
    const uniqueTags: { [name: string]: { name: string; color: string } } = {};
    for (const wish of items) {
      if (!wish.tags) continue;
      for (const tag of wish.tags) {
        if (!uniqueTags[tag.name]) {
          uniqueTags[tag.name] = { name: tag.name, color: tag.color || '#e0f7fa' };
        }
        if (Object.keys(uniqueTags).length >= 3) break;
      }
      if (Object.keys(uniqueTags).length >= 3) break;
    }
    return Object.values(uniqueTags).slice(0, 3);
  }

  /**
   * @function deleteCollection
   * @description Handler to trigger deletion of a collection.
   * @param collection - The collection object to delete.
   */
  deleteCollection(collection: any){
    console.log('Delete collection:', collection);
  }

  //todo implementar que aqui se lleve a edit
  /**
   * @function editCollection
   * @description Handler to trigger editing of a collection and redirects user to edit page.
   * @param collection - The collection object to edit.
   */
  editCollection(collection: any){
    console.log('Edit collection:', collection);
    this.router.navigate(['/collections', collection.id, 'edit']);
  }

  /**
   * @function shareCollection
   * @description Handler to trigger sharing of a collection.
   * @param collection - The collection object to share.
   */
  shareCollection(collection: any): void {
    console.log('Share collection:', collection);
  }

  /**
   * @function navigateToCollection
   * @description Navigates to the collection detail page.
   * @param id - The ID of the collection.
   */
  navigateToCollection(id: string): void {
    this.router.navigate(['/collections', id]);
  }
}
