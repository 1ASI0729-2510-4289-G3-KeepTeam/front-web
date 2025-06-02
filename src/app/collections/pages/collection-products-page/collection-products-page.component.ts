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
import {CollectionCardComponent} from '../../components/collection-card/collection-card.component';
import {FullCollection} from '../../model/fullCollection.entity';
import {Collection} from '../../model/collection.entity';
import {CreationButtonsComponent} from '../../components/creation-buttons/creation-buttons.component';
import {PopConfirmDialogComponent} from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

/**
 * @component CollectionProductsPageComponent
 * @description
 * Displays a page showing all items within a specific collection.
 * Uses SidebarComponent and ProductItemCardComponent for layout and item rendering.
 * Fetches product data from CollectionsService based on route parameter.
 */
@Component({
  selector: 'app-collection-products-page',
  imports: [SidebarComponent, ProductItemCardComponent, CommonModule, MatIcon, ItemActionsComponent, SearchBarComponent, CollectionCardComponent, CreationButtonsComponent, CollectionCardComponent],
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
  public subCollections: Collection[] = [];

  /**
   * @property collectionId
   * @description The ID of the collection, retrieved from the route parameters.
   */
  collectionId: number = 0;
  collection: Collection | undefined;
  creationButtons: { id: number; name: string; link: string; backgroundColor: string; color: string; }[] | undefined
  /**
   * @constructor
   * @param collectionsService - Service to fetch collections and products.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router
   */


  /**
   * @constructor
   * @param collectionsService - Service to fetch collections and products.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router
   * @param dialog
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}


  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches items for the collection
   * when the component is initialized.
   */
  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        console.error("No collection ID provided in the route!");
        this.router.navigate(['/collections']);
        return;
      }
      this.collectionId = Number(idParam);

      this.creationButtons = [
        { id: 1, name: 'Add sub-collection', link: `/collections/${this.collectionId}/7`, backgroundColor: '#FEDD72', color: '#BD6412' },
        { id: 2, name: 'Add Wish', link: `/collections/${this.collectionId}/new/edit`, backgroundColor: '#FF8B68', color: '#FFFAF3' }
      ];

      this.getCollection(this.collectionId);
      this.getProducts();
      this.loadCollections();
      this.loadSubCollections();
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

  loadSubCollections() {
    this.subCollections = []
    this.collectionsService.getSubCollectionsByParentId(this.collectionId).subscribe({
      next: (subCollections: Collection[]) => {
        this.subCollections = subCollections;
        console.log(subCollections);
      },
      error: (err) => {
        console.error('Error loading subcollections:', err);
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
   * @param collection
   */
  deleteCollection(collection: any){
    console.log('Delete collection:', collection);
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `¿Are you sure you want to delete <strong>${collection.title}</strong>? <br> You can later restore it in the trashcan section`
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedItem = { ...collection, isInTrash: true };
        this.collectionsService.updateCollection(updatedItem).subscribe(() => {
          console.log('Collection moved to trashcan');
          this.loadCollections();
        });
      }
    });
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

  /**
   * @function deleteWish
   * @description Handles the deletion process of a Wish item.
   * Shows a confirmation dialog and performs a soft delete.
   * @param wish - The Wish object to be soft-deleted.
   */
  deleteWish(wish: Wish) {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `¿Are you sure you want to delete <strong>${wish.title}</strong>? <br> You can later restore it in the trashcan section`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedWish = { ...wish, isInTrash: true };
        this.collectionsService.updateWish(updatedWish).subscribe(() => {
          console.log('Wish moved to trashcan');
          this.productList = this.productList.filter(p => p.id !== wish.id);
        }, error => {
          console.error('Error updating wish to trashcan:', error);
        });
      }
    });
  }

  /**
   * @function editWish
   * @description Handles the editing of a Wish item and redirects to its edit page.
   * @param wish - The Wish object to edit.
   */
  editWish(wish: Wish) {
    if (wish && wish.id && wish.idCollection) {
      this.router.navigate(['/collections', wish.idCollection, wish.id, 'edit']);
    } else {
      console.warn('Cannot edit wish: Missing wish.id or wish.idCollection', wish);
    }
  }

  /**
   * @function shareWishLink
   * @description Handles sharing a Wish item via link.
   * @param wish - The Wish object to share.
   */
  shareWishLink(wish: Wish): void {
    if (wish && wish.id) {
      this.router.navigate(['/share-settings'], {
        queryParams: {
          contentType: 'wish',
          itemId: wish.id,
          previousUrl: this.router.url
        }
      });
    } else {
      console.warn('Cannot share wish link: Missing wish.id', wish);
    }
  }

  /**
   * @function shareWishQr
   * @description Handles sharing a Wish item via QR code.
   * @param wish - The Wish object to share.
   */
  shareWishQr(wish: Wish): void {
    if (wish && wish.id) {
      this.router.navigate(['/share-qr'], {
        queryParams: {
          contentType: 'wish',
          itemId: wish.id,
          previousUrl: this.router.url
        }
      });
    } else {
      console.warn('Cannot share wish QR: Missing wish.id', wish);
    }
  }
}
