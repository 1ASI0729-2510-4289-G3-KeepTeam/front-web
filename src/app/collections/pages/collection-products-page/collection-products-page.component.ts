import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ProductItemCardComponent } from '../../components/product-item-card/product-item-card.component';
import { CollectionsService } from '../../services/collections.service';
import { Wish } from '../../model/wish.entity';
import { ActivatedRoute } from '@angular/router';
import {MatIcon} from '@angular/material/icon';
/**
 * @component CollectionProductsPageComponent
 * @description
 * Displays a page showing all items within a specific collection.
 * Uses SidebarComponent and ProductItemCardComponent for layout and item rendering.
 * Fetches product data from CollectionsService based on route parameter.
 */
@Component({
  selector: 'app-collection-products-page',
  imports: [SidebarComponent, ProductItemCardComponent, CommonModule, MatIcon],
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
  private collectionId: string;

  /**
   * @constructor
   * @param collectionsService - Service to fetch collections and products.
   * @param route - ActivatedRoute for accessing route parameters.
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute
  ) {
    this.collectionId = this.route.snapshot.paramMap.get('id') ?? '098';
  }

  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches items for the collection
   * when the component is initialized.
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.collectionsService.getProductsByIdCollection(id!).subscribe((data) => {
      console.log('Products received:', data);
      this.productList = data;
    });
  }

  /**
   * @function goBack
   * @description Navigates back to the previous page in browser history.
   */
  goBack(): void {
    history.back();
  }
}
