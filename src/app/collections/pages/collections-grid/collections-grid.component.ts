import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

import { CreationButtonsComponent } from '../../components/creation-buttons/creation-buttons.component';

import { CollectionCardComponent } from '../../components/collection-card/collection-card.component';

import { CommonModule} from '@angular/common';

import { CollectionsService } from '../../services/collections.service';

import { Wish } from '../../model/wish.entity';

import { Router } from '@angular/router';

import {FullCollection} from '../../model/fullCollection.entity';

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

    CommonModule,

  ],

  templateUrl: './collections-grid.component.html',

  styleUrl: './collections-grid.component.css',

})

export class CollectionsGridComponent implements OnInit {

  /**

   * @property collections

   * @description List of collections with basic details.

   */

  collections: FullCollection[] = [];

  items: Wish[] = [];



  creationButtons: { name: string; link: string; backgroundColor: string; color: string; }[] | undefined = [

    { name: 'Add sub-collection', link: '/collections/1/7', backgroundColor: '#FEDD72', color: '#BD6412' },

    { name: 'Add Collection', link: '/collections/new/edit', backgroundColor: '#FF8B68', color: '#FFFAF3' }

  ]



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

  loadCollections() {

    this.collectionsService.getFullCollections().subscribe({

      next: (data: FullCollection[]) => {

        this.collections = data.filter(c => c.idParentCollection === 0);

      },

      error: (error) => {

        console.error('Error loading collections:', error);

      }

    });

  }



  /**

   * @function deleteCollection

   * @description Handler to trigger deletion of a collection.

   * @param collection - The collection object to delete.

   */

  deleteCollection(collection: any){

    console.log('Delete collection:', collection);

  }



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

    console.log('Compartiendo colección:', collection);

    console.log('ID de la colección:', collection.id);

    this.router.navigate(['/share-settings'], {

      queryParams: {

        contentType: 'collection',

        itemId: collection.id,

        previousUrl: this.router.url

      }

    });

  }



  /**

   * @function navigateToCollection

   * @description Navigates to the collection detail page.

   * @param id - The ID of the collection.

   */

  navigateToCollection(id: number): void {

    this.router.navigate(['/collections', id]);

  }



  navigateToQrShare(collection: any): void {

    this.router.navigate(['/share-qr'], {

      queryParams: {

        contentType: 'collection',

        itemId: collection.id,

        previousUrl: this.router.url

      }

    });

  }



}

