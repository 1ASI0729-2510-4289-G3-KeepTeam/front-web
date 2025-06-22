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
import {SearchResult} from '../../../shared/models/search-result.interface';
import {Subscription} from 'rxjs';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

/**
 * @component CollectionProductsPageComponent
 * @description
 * Displays a page showing all items within a specific collection.
 * Uses SidebarComponent and ProductItemCardComponent for layout and item rendering.
 * Fetches product data from CollectionsService based on route parameter.
 */
@Component({
  selector: 'app-collection-products-page',
  standalone: true,
  imports: [
    SidebarComponent,
    ProductItemCardComponent,
    CommonModule,
    MatIcon,
    ItemActionsComponent,
    SearchBarComponent,
    CollectionCardComponent,
    CreationButtonsComponent,
    ToolbarComponent
  ],
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
  creationButtons: { id: number; name: string; link: string | any[];queryParams?: any; backgroundColor: string; color: string; }[] | undefined;

  private langChangeSub: Subscription | undefined;

  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.setCreationButtons();

    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setCreationButtons();
    });
  }

  private setCreationButtons() {
    this.creationButtons = [
      {  id: 1,
        name: this.translate.instant('navs.addSubCollection'),
        link: ['/collections/create'],
        queryParams: { parentId: this.collectionId },
        backgroundColor: '#FEDD72',
        color: '#BD6412'},
      { id: 2, name: this.translate.instant('navs.addWish'), link: `/collections/${this.collectionId}/new/edit`, backgroundColor: '#FF8B68', color: '#FFFAF3' }

    ];
  }

  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches items for the collection
   * when the component is initialized.
   */
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        this.router.navigate(['/collections']);
        return;
      }
      this.collectionId = Number(idParam);
      this.setCreationButtons();
      this.getCollection(this.collectionId);
      this.getProducts();
      this.loadCollections();
      this.loadSubCollections();


    });
  }

  /**
   * @function filterCreationButtonForSubCollection
   * @description Adjusts creation buttons based on whether the current collection is a sub-collection.
   */
  filterCreationButtonForSubCollection() {
    if (this.collection!.idParentCollection !== 0) {
      this.creationButtons = this.creationButtons!.filter(b => b.id !== 1);
    }
  }

  /**
   * @function goBack
   * @description Navigates back to the previous collection page or root collections page.
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

  /**
   * @function getCollection
   * @description Fetches the current collection's details by ID.
   * @param collectionId The ID of the collection to fetch.
   */
  getCollection(collectionId: number) {
    this.collection = undefined;
    this.collectionsService.getCollectionById(collectionId).subscribe(collection => {
      this.collection = collection;
      this.filterCreationButtonForSubCollection();
    });
  }

  /**
   * @function getProducts
   * @description Fetches all wishes/items belonging to the current collection.
   */
  getProducts() {
    if (this.collectionId) {
      this.collectionsService.getProductsByIdCollection(this.collectionId).subscribe((data) => {
        this.productList = data;
      });
    }
  }

  /**
   * @function handleItemSelected
   * @description Handles the event when an item (Wish or SubCollection) is selected from the search bar autocomplete.
   * Navigates to the item's edit page or the subcollection's detail page.
   * @param result - The selected search result.
   */
  handleItemSelected(result: SearchResult): void {
    if (result.type === 'wish') {
      // Assuming navigation to edit page for a wish
      this.router.navigate(['/collections', this.collectionId, result.id, 'edit']);
    } else if (result.type === 'collection') {
      this.navigateToCollection(result.id);
    } else {
    }
  }

  /**
   * @function shareCollection
   * @description Navigates to the share settings page for the current collection.
   */
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
   * @description Fetches sub-collections (as FullCollection) from the service for display as cards.
   */
  loadCollections() {
    this.collections = [];
    this.collectionsService.getSubCollectionsFromCollection(this.collectionId).subscribe({
      next: (data: FullCollection[]) => {
        this.collections = data.filter(c => !c.isInTrash);
      },
      error: (error) => {
        console.error('Error loading collections:', error);
      }
    });
  }

  /**
   * @function loadSubCollections
   * @description Fetches sub-collections (as Collection) for the sidebar navigation.
   */
  loadSubCollections() {
    this.subCollections = [];
    this.collectionsService.getSubCollectionsByParentId(this.collectionId).subscribe({
      next: (subCollections: Collection[]) => {
        this.subCollections = subCollections.filter(c => !c.isInTrash);
      },
      error: (err) => {
        console.error('Error loading subcollections:', err);
      }
    });
  }

  /**
   * @function shareCollectionQr
   * @description Navigates to the QR share page for the current collection.
   */
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
   * @function deleteSubCollectionCard
   * @description Handler to trigger deletion of a sub-collection shown as a card (soft delete).
   * Opens a confirmation dialog and performs a soft delete if confirmed.
   * After deletion, it reloads the sub-collections and sidebar to update the view.
   * This method is called when deleting a sub-collection card.
   * @param collection - The sub-collection object to be soft-deleted.
   */
  deleteSubCollectionCard(collection: any){
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
          this.loadCollections();
          this.loadSubCollections();
        }, error => {
          console.error('Error moving collection to trashcan:', error);
        });
      }
    });
  }

  /**
   * @function handleCurrentCollectionDeletion
   * @description Handles the deletion of the *current* collection being viewed on the page.
   * Opens a confirmation dialog, performs a soft delete, and then navigates away from the page.
   * This method is called from ItemActionsComponent for the main collection.
   * @param collection - The current collection object to be soft-deleted.
   */
  handleCurrentCollectionDeletion(collection: any): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `¿Are you sure you want to delete <strong>${collection.title}</strong>? <br> You can later restore it in the trashcan section`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedCollection = { ...collection, isInTrash: true };
        this.collectionsService.updateCollection(updatedCollection).subscribe(() => {
          if (this.collection?.idParentCollection !== 0) {
            this.router.navigate(['/collections', this.collection?.idParentCollection]);
          } else {
            this.router.navigate(['/collections']);
          }
        }, error => {
          console.error('Error moving current collection to trashcan:', error);
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

  /**
   * @function navigateToQrShare
   * @description Navigates to the QR share page for a given collection.
   * @param collection - The collection object to share via QR.
   */
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
    }
  }
}
