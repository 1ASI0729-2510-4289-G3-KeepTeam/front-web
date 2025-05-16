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

/**
 * @component CollectionProductsPageComponent
 * @description
 * Displays a page showing all items within a specific collection.
 * Uses SidebarComponent and ProductItemCardComponent for layout and item rendering.
 * Fetches product data from CollectionsService based on route parameter.
 */
@Component({
  selector: 'app-collection-products-page',
  imports: [SidebarComponent, ProductItemCardComponent, CommonModule, MatIcon, ItemActionsComponent, SearchBarComponent],
  templateUrl: './collection-products-page.component.html',
  styleUrl: './collection-products-page.component.css',
})
export class CollectionProductsPageComponent implements OnInit {
  /**
   * @property productList
   * @description Array of wishes/products to be displayed on the page.
   */
  public productList: Wish[] = [];


  /**
   * @property collectionId
   * @description The ID of the collection, retrieved from the route parameters.
   */
  collectionId: string;

  /**
   * @constructor
   * @param collectionsService - Service to fetch collections and products.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router
   * @param location
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.collectionId = this.route.snapshot.paramMap.get('id') ?? '098';

  }

  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches items for the collection
   * when the component is initialized.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.collectionId = params['id'];
      if (this.collectionId) {  // Check if collectionId has a value
        this.getProducts();
      } else {
        // Handle the case where there's no collectionId in the route
        console.error("No collection ID provided in the route!");
        // Maybe redirect to /collections or show an error message
        this.router.navigate(['/collections']); // Example: Redirect
      }
    });
  }

  /**
   * @function goBack
   * @description Navigates back to the previous page in browser history.
   */
  goBack(): void {
    const currentUrl = this.router.url;
    const parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));

    if (parentUrl === '/collections' || currentUrl === '/collections') {
      this.router.navigate(['/collections']);
    } else if (this.collectionId && currentUrl === `/collections/${this.collectionId}`) { // Check collectionId
      this.router.navigate(['/collections']);
    } else {
      this.location.back();
    }
  }

  getProducts() {
    if (this.collectionId) { // Check before using collectionId
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

  shareCollectionQr(): void {
    this.router.navigate(['/share-qr'], {
      queryParams: {
        contentType: 'collection',
        itemId: this.collectionId,
        previousUrl: this.router.url
      }
    });
  }

}
