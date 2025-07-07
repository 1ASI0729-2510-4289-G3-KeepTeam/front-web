import { Component, OnInit, OnDestroy } from '@angular/core';
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
import {Collection} from '../../model/collection.entity'; // Make sure Collection interface/class is correctly imported
import {CreationButtonsComponent} from '../../components/creation-buttons/creation-buttons.component';
import {PopConfirmDialogComponent} from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SearchResult} from '../../../shared/models/search-result.interface';
import {Subscription} from 'rxjs';
import {LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {PdfExportService} from '../../services/pdf-export.service';

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
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './collection-products-page.component.html',
  styleUrl: './collection-products-page.component.css',
})
export class CollectionProductsPageComponent implements OnInit, OnDestroy {
  /**
   * @property productList
   * @description Array of wishes/products to be displayed on the page.
   */
  public productList: Wish[] = [];
  /**
   * @property collections
   * @description Array of sub-collections (as FullCollection) to be displayed as cards in the main content area.
   */
  public collections: FullCollection[] = [];
  /**
   * @property subCollections
   * @description Array of sub-collections (as Collection) specifically for the sidebar navigation.
   */
  public subCollections: Collection[] = [];

  /**
   * @property collectionId
   * @description The ID of the collection, retrieved from the route parameters.
   */
  collectionId: number = 0;
  /**
   * @property collection
   * @description The current collection object being viewed.
   */
  collection: Collection | undefined;
  /**
   * @property creationButtons
   * @description Configuration for the creation buttons (add sub-collection, add wish).
   */
  creationButtons: { id: number; name: string; link: string | any[];queryParams?: any; backgroundColor: string; color: string; }[] | undefined;

  /**
   * @property langChangeSub
   * @description Subscription to the language change event for updating button labels.
   * @private
   */
  private langChangeSub: Subscription | undefined;
  /**
   * @property routeSub
   * @description Subscription to route parameter changes.
   * @private
   */
  private routeSub: Subscription | undefined;

  /**
   * @constructor
   * @param collectionsService - Service for managing collections and wishes.
   * @param route - ActivatedRoute for accessing route parameters.
   * @param router - Angular Router for programmatic navigation.
   * @param dialog - MatDialog service for opening confirmation dialogs.
   * @param translate - TranslateService for internationalization.
   * @param pdfExportService - Service for exporting collections to PDF.
   */
  constructor(
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService,
    private pdfExportService: PdfExportService
  ) {
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setCreationButtons();
    });
  }

  /**
   * @function setCreationButtons
   * @description Configures the creation buttons, translating their names and setting their links.
   */
  private setCreationButtons(): void {
    if (!this.collection) {
      console.warn('[setCreationButtons] La colección no está definida todavía.');
      return;
    }

    const buttons = [
      {
        id: 1,
        name: this.translate.instant('navs.addSubCollection'),
        link: ['/collections', 'new', 'edit'],
        queryParams: { parentId: this.collectionId },
        backgroundColor: '#FEDD72',
        color: '#BD6412'
      },
      {
        id: 2,
        name: this.translate.instant('navs.addWish'),
        link: ['/collections', this.collectionId, 'products', 'new', 'edit'],
        backgroundColor: '#FF8B68',
        color: '#FFFAF3'
      }
    ];

    if (this.collection.idParentCollection !== 0) {
      this.creationButtons = buttons.filter(b => b.id !== 1);
    } else {
      this.creationButtons = buttons;
    }

    console.log('Botones creados:', this.creationButtons);
  }
  /**
   * @function ngOnInit
   * @description Lifecycle hook that fetches items and sub-collections for the current collection
   * when the component is initialized, based on route parameters.
   */
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        this.router.navigate(['/collections']);
        return;
      }
      this.collectionId = Number(idParam);

      this.getCollection(this.collectionId);
      this.getProducts();
      this.loadCollections();
      this.loadSubCollectionsForSidebar();
    });
  }

  /**
   * @function loadSubCollectionsForSidebar
   * @description Fetches sub-collections specifically for the sidebar navigation.
   * Only loads if the current collection is a top-level collection (idParentCollection === 0)
   * or if it's the direct parent.
   */
  private loadSubCollectionsForSidebar(): void {
    if (this.collectionId === 0) {
      return;
    }

    let parentCollectionIdForSidebar: number;

    if (this.collection?.idParentCollection !== 0 && this.collection?.idParentCollection !== undefined) {
      parentCollectionIdForSidebar = this.collection.idParentCollection;
    } else {
      parentCollectionIdForSidebar = this.collectionId;
    }
    if (parentCollectionIdForSidebar !== undefined && parentCollectionIdForSidebar !== null) {
      this.collectionsService.getSubCollectionsByParentId(parentCollectionIdForSidebar).subscribe({
        next: (data: Collection[]) => {
          this.subCollections = data.filter(c => !c.isInTrash);
          console.log(`[CollectionProductsPage] subCollections (for sidebar) updated for ID ${parentCollectionIdForSidebar}:`, this.subCollections.map(c => c.title));
        },
        error: (error) => {
          console.error(this.translate.instant('consoleMessages.errorLoadingSubCollectionsForSidebar'), error);
        }
      });
    }
  }


  /**
   * @function ngOnDestroy
   * @description Lifecycle hook to unsubscribe from all observables to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }


  /**
   * @function goBack
   * @description Navigates back to the parent collection page if it exists, otherwise
   * navigates to the root collections page or the previous page in history.
   */
  goBack(): void {
    if(this.collection?.idParentCollection !== 0) {
      this.router.navigate(['collections', this.collection?.idParentCollection]);
    } else{
      // If no parent, navigate to the main /collections page
      this.router.navigate(['/collections']);
    }
  }

  /**
   * @function getCollection
   * @description Fetches the current collection's details by ID.
   * @param collectionId - The ID of the collection to fetch.
   */
  getCollection(collectionId: number): void {
    this.collectionsService.getCollectionById(collectionId).subscribe((collection: any) => {
      this.collection = {
        ...collection,
        title: collection.title
      };
      console.log("coleccion",this.collection)
      this.setCreationButtons();
    });
  }

  /**
   * @function getProducts
   * @description Fetches all wishes/items belonging to the current collection
   * and filters out those marked as in trash.
   */
  getProducts(): void {
    if (this.collectionId) {
      console.log(`[CollectionProductsPage] getProducts for collectionId: ${this.collectionId}`);
      this.collectionsService.getProductsByIdCollection(this.collectionId).subscribe((data: Wish[]) => {
        this.productList = data.filter(item => !item.isInTrash);
        console.log(`[CollectionProductsPage] productList (for sidebar.nav) updated for ID ${this.collectionId}:`, this.productList.map(p => p.title));
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
      this.router.navigate(['/collections', this.collectionId, result.id, 'edit']);
    } else if (result.type === 'collection') {
      this.navigateToCollection(result.id);
    } else {
      console.warn(this.translate.instant('consoleMessages.unsupportedSearchResultType'), result.type);
    }
  }


  /**
   * @function loadCollections
   * @description Fetches sub-collections (as FullCollection) from the service for display as cards
   * in the main content area, filtering out those in trash.
   */
  loadCollections(): void {
    console.log(`[CollectionProductsPage] loadCollections (main content grid) for collectionId: ${this.collectionId}`);
    this.collectionsService.getSubCollectionsFromCollection(this.collectionId).subscribe({
      next: (data: FullCollection[]) => {
        this.collections = data.filter(c => !c.isInTrash);
        console.log(`[CollectionProductsPage] collections (main content grid) updated for ID ${this.collectionId}:`, this.collections.map(c => c.title));
      },
      error: (error) => {
        console.error(this.translate.instant('consoleMessages.errorLoadingCollections'), error);
      }
    });
  }




  /**
   * @function deleteSubCollectionCard
   * @description Handler to trigger deletion of a sub-collection shown as a card (soft delete).
   * Opens a confirmation dialog and performs a soft delete if confirmed.
   * After deletion, it reloads both the main collection cards and the sidebar sub-collections to update the view.
   * This method is called when deleting a sub-collection card.
   * @param collection - The sub-collection object to be soft-deleted.
   */
  deleteSubCollectionCard(collection: any): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: this.translate.instant('itemsAction.deleteCollection'),
        message: this.translate.instant('itemsAction.deleteCollectionConfirm', { title: collection.title })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedItem = { ...collection, isInTrash: true };
        this.collectionsService.updateCollection(updatedItem).subscribe(() => {
          this.loadCollections();
          this.loadSubCollectionsForSidebar();
        }, error => {
          console.error(this.translate.instant('consoleMessages.errorMovingCollectionToTrash'), error);
        });
      }
    });
  }
  /**
   * @function handleCurrentCollectionDeletion
   * @description Handles the deletion of the *current* collection being viewed on the page.
   * Opens a confirmation dialog, performs a soft delete, and then navigates away from the page
   * to its parent collection or the root collections page.
   * This method is called from ItemActionsComponent for the main collection.
   * @param collection - The current collection object to be soft-deleted.
   */
  handleCurrentCollectionDeletion(collection: any): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: this.translate.instant('itemsAction.deleteCollection'),
        message: this.translate.instant('itemsAction.deleteCollectionConfirm', { title: collection.title })
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
          console.error(this.translate.instant('consoleMessages.errorMovingCurrentCollectionToTrash'), error);
        });
      }
    });
  }


  /**
   * @function editCollection
   * @description Handler to trigger editing of a collection and redirects user to edit page.
   * @param collection - The collection object to edit.
   */
  editCollection(collection: any): void {
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
   * @function exportCollectionPdf
   * @description Exports the current main collection to a PDF file.
   * @param collection - The current collection object to export.
   */
  exportCollectionPdf(collection: any): void {
    console.log('Exporting PDF for collection:', collection.title);
    this.pdfExportService.exportCollectionToPdf(collection);
  }

  /**
   * @function exportSubCollectionToPdf
   * @description Exports a sub-collection to a PDF file.
   * This method is triggered from a `CollectionCardComponent` within the main content area.
   * @param collection - The sub-collection object to export.
   */
  exportSubCollectionToPdf(collection: any): void {
    this.pdfExportService.exportCollectionToPdf(collection);
  }

  /**
   * @function deleteWish
   * @description Handles the deletion process of a Wish item.
   * Shows a confirmation dialog and performs a soft delete by setting `isInTrash` to true.
   * Updates the `productList` to remove the deleted wish from the display.
   * @param wish - The Wish object to be soft-deleted.
   */
  deleteWish(wish: Wish): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: this.translate.instant('itemsAction.deleteItem'),
        message: this.translate.instant('itemsAction.deleteItemConfirm', { title: wish.title })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedWish = { ...wish, isInTrash: true };
        this.collectionsService.updateWish(updatedWish).subscribe(() => {
          this.productList = this.productList.filter(p => p.id !== wish.id); // Filter out the deleted item
        }, error => {
          console.error(this.translate.instant('consoleMessages.errorUpdatingWishToTrashcan'), error);
        });
      }
    });
  }

  /**
   * @function editWish
   * @description Handles the editing of a Wish item and redirects to its edit page.
   * Requires `wish.id` and `wish.collectionId` for navigation.
   * @param wish - The Wish object to edit.
   */
  editWish(wish: Wish): void {
    if (wish && wish.id && wish.collectionId) {
      this.router.navigate(['/collections', wish.collectionId, wish.id, 'edit']);
    } else {
      console.warn(this.translate.instant('consoleMessages.errorEditingWish'), wish);
    }
  }

  /**
   * @function shareWishLink
   * @description Handles sharing a Wish item via link.
   * Navigates to the '/link-share' page with appropriate query parameters.
   * @param wish - The Wish object to share.
   */
  shareWishLink(wish: any): void {
    console.log('Attempting to share link for wish:', wish);

    const shareableLink = wish.redirectUrl;

    if (!shareableLink || shareableLink.trim() === '') {
      console.warn('The wish does not have a defined redirectUrl to share:', wish);
      return;
    }

    this.router.navigate(['/link-share'], {
      queryParams: {
        link: shareableLink,
        contentType: 'wish',
        itemId: wish.id,
        returnUrl: this.router.url
      }
    });
  }

  /**
   * @function shareWishQr
   * @description Handles sharing a Wish item via QR code.
   * Navigates to the '/share-qr' page with appropriate query parameters.
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
      console.warn(this.translate.instant('consoleMessages.errorSharingWishQr'), wish);
    }
  }
}
