import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {SearchResult} from '../../../shared/models/search-result.interface';
import { MatDialog } from '@angular/material/dialog';
import { PopConfirmDialogComponent } from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {ToolbarComponent} from "../../../public/components/toolbar/toolbar.component";

/**
 * @component CollectionsGridComponent
 * @description
 * Displays a grid of collection cards.
 * Loads collections with their associated wishes and allows operations like view, edit, share, and delete.
 */
@Component({
  selector: 'app-collections-grid',
  standalone: true,
  imports: [
    MatIconModule,
    SidebarComponent,
    SearchBarComponent,
    CreationButtonsComponent,
    CollectionCardComponent,
    CommonModule,
    TranslatePipe,
    ToolbarComponent,
  ],
  templateUrl: './collections-grid.component.html',
  styleUrl: './collections-grid.component.css',
})
export class CollectionsGridComponent implements OnInit, OnDestroy {
  /**
   * @property collections
   * @description List of collections with basic details.
   */
  collections: FullCollection[] = [];
  items: Wish[] = [];
  creationButtons: { name: string; link: string; backgroundColor: string; color: string }[] = [];
  langChangeSub: Subscription;
  /**
   * @constructor
   * @param collectionsService - Service to fetch collections data.
   * @param router - Angular Router for navigation.
   * @param dialog - MatDialog service for opening confirmation dialogs.
   * @param translate
   */
  constructor(
    private collectionsService: CollectionsService,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.setCreationButtons();
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setCreationButtons();
    });
  }


setCreationButtons() {
  const translatedName = this.translate.instant('navs.addCollection');
  this.creationButtons = [
    {
      name: translatedName,
      link: '/collections/new/edit',
      backgroundColor: '#FF8B68',
      color: '#FFFAF3',
    }
  ];
}

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
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
   * Only loads top-level collections (idParentCollection === 0) that are not in trash.
   */
  loadCollections() {
    this.collectionsService.getFullCollections().subscribe({
      next: (data: FullCollection[]) => {
        this.collections = data.filter(c => c.idParentCollection === 0 && !c.isInTrash);
      },
      error: (error) => {
        console.error('Error loading collections:', error);
      }
    });
  }

  /**
   * @function handleCollectionSelected
   * @description Handles the event when a collection is selected from the search bar autocomplete.
   * @param result - The selected search result.
   */
  handleCollectionSelected(result: SearchResult): void {
    if (result.type === 'collection') {
      this.navigateToCollection(result.id);
    } else {
    }
  }


  /**
   * @function deleteCollection
   * @description Handler to trigger deletion of a collection.
   * Opens a confirmation dialog and performs a soft delete (moves to trash) if confirmed.
   * After deletion, it reloads the collections to update the view.
   * @param collection - The collection object to delete.
   */
  deleteCollection(collection: any){
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
          this.loadCollections();
        }, error => {
          console.error('Error moving collection to trashcan:', error);
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
   * @function shareCollection
   * @description Handler to trigger sharing of a collection.
   * Navigates to the share settings page with relevant query parameters.
   * @param collection - The collection object to share.
   */
  shareCollection(collection: any): void {
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
}
