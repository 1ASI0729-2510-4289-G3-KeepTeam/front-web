import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ProductItemCardComponent } from '../../components/product-item-card/product-item-card.component';
import { CollectionsService } from '../../services/collections.service';
import { Wish } from '../../model/wish.entity';

@Component({
  selector: 'app-collection-products-page',
  imports: [SidebarComponent, ProductItemCardComponent, CommonModule],
  templateUrl: './collection-products-page.component.html',
  styleUrl: './collection-products-page.component.css',
})
export class CollectionProductsPageComponent implements OnInit {
  public productList: Wish[] = [];
  private collectionId = '';

  // private collectionId = window.location.search;

  constructor(private collectionsService: CollectionsService) {
    this.collectionId =
      new URLSearchParams(window.location.search).get('collectionId') ?? '098';
  }

  ngOnInit() {
    this.collectionsService
      .getProductsByCollectionId(this.collectionId)
      .subscribe((data) => {
        this.productList = data;
      });
  }
}
