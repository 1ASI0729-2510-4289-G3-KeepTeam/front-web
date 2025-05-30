import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ProductItemCardComponent } from '../../components/product-item-card/product-item-card.component';
import { CollectionsService } from '../../services/collections.service';
import { Wish } from '../../model/wish.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ItemActionsComponent} from '../../components/item-actions/item-actions.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {Location} from "@angular/common";
import {CollectionCardComponent} from '../../components/collection-card/collection-card.component';
import {FullCollection} from '../../model/fullCollection.entity';
import {Collection} from '../../model/collection.entity';
import {Observable} from 'rxjs';
import {CreationButtonsComponent} from '../../components/creation-buttons/creation-buttons.component';

/**
 * @component CollectionProductsPageComponent
 * @description
 * Displays a page showing all items within a specific collection.
 * Uses SidebarComponent and ProductItemCardComponent for layout and item rendering.
 * Fetches product data from CollectionsService based on route parameter.
 */
@Component({
  selector: 'app-collection-products-page',
  imports: [SidebarComponent, ProductItemCardComponent, CommonModule, MatIcon, ItemActionsComponent, SearchBarComponent, CollectionCardComponent, CreationButtonsComponent],
  templateUrl: './collection-products-page.component.html',
  styleUrl: './collection-products-page.component.css',
})
export class CollectionProductsPageComponent implements OnInit {
  /**
   * @property productList
   * @description Array of wishes/products to be displayed on the page.
   */
  public productList: Wish[] = [];
  public collections: FullCollection[] = [];

  /**
   * @property collectionId
   * @description The ID of the collection, retrieved from the route parameters.
   */
  collectionId: number;
  collection: Collection | undefined;

  /**
   * @constructor
   * @param collectionsService - Service to fetch collections and products.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const collectionIdTemp = this.route.snapshot.paramMap.get('id') ?? '1';
    this.collectionId = Number(collectionIdTemp)
  }
  creationButtons: { id: number,name: string; link: string; backgroundColor: string; color: string; }[] | undefined = [
    { id: 1 ,name: 'Add sub-collection', link: '/collections/1/7', backgroundColor: '#FEDD72', color: '#BD6412' },
    { id: 2 ,name: 'Add Wish', link: '', backgroundColor: '#FF8B68', color: '#FFFAF3' }
  ]

  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches items for the collection
   * when the component is initialized.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.collectionId = params['id'];

      if (this.collectionId) {
        this.getCollection(this.collectionId);
        this.getProducts();
        this.loadCollections();
      } else {
        console.error("No collection ID provided in the route!");
        this.router.navigate(['/collections']);
      }

    });

  }


  filterCreationButtonForSubCollection() {
    if (this.collection!.idParentCollection !== 0) {
      this.creationButtons = this.creationButtons!.filter(b => b.id !== 1);
    }
  }

  /**
   * @function goBack
   * @description Navigates back to the previous page in browser history.
   */
  goBack(): void {
    if(this.collection?.idParentCollection != 0) {
      this.router.navigate(['collections',this.collection?.idParentCollection]);
    } else{
      const currentUrl = this.router.url;
      const segments = currentUrl.split('/');
      segments.pop();

      const newUrl = segments.join('/');
      this.router.navigate([newUrl]);
    }

  }

  getCollection(collectionId: number) {
    this.collection = undefined
    this.collectionsService.getCollectionById(collectionId).subscribe(collection => {
      this.collection = collection;
      this.filterCreationButtonForSubCollection()
    });
  }

  getProducts() {
    if (this.collectionId) {
      this.collectionsService.getProductsByIdCollection(this.collectionId).subscribe((data) => {
        this.productList = data;
      });
    }
  }

  shareCollection(): void {
    this.router.navigate(['/share-settings'], {
      queryParams: {
        contentType: 'collection',
        itemId: this.collectionId,
        previousUrl: this.router.url
      }
    });
  }
  /**
   * @function loadCollections
   * @description Fetches collections from the service and maps them to the local collections array.
   */
  loadCollections() {
    this.collections = [];
    this.collectionsService.getSubCollectionsFromCollection(this.collectionId).subscribe({
      next: (data: FullCollection[]) => {

        this.collections = data;
      },
      error: (error) => {
        console.error('Error loading collections:', error);
      }
    });
  }

  shareCollectionQr(): void {
    this.router.navigate(['/share-qr'], {
      queryParams: {
        contentType: 'collection',
        itemId: this.collectionId,
        previousUrl: this.router.url
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
