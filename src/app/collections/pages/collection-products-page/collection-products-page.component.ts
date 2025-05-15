import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ProductItemCardComponent } from '../../components/product-item-card/product-item-card.component';
import { CollectionsService } from '../../services/collections.service';
import { Wish } from '../../model/wish.entity';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collection-products-page',
  imports: [SidebarComponent, ProductItemCardComponent, CommonModule],
  templateUrl: './collection-products-page.component.html',
  styleUrl: './collection-products-page.component.css',
})
export class CollectionProductsPageComponent implements OnInit {
  public productList: Wish[] = [];
  private collectionId: string;

  // private collectionId = window.location.search;

  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute

  ) {
    this.collectionId = this.route.snapshot.paramMap.get('id') ?? '098';
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.collectionsService.getProductsByIdCollection(id!).subscribe((data) => {
      console.log('Productos recibidos:', data);
      this.productList = data;
    });
  }}
