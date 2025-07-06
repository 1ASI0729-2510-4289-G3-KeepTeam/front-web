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
import {forkJoin, Subscription} from 'rxjs';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {PdfExportService} from '../../services/pdf-export.service';

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
   * @description List of top-level collections to be displayed in the grid.
   */
  collections: FullCollection[] = [];

  /**
   * @property items
   * @description List of wishes (items) that might be associated with collections.
   * (Currently unused in this component's logic based on provided code.)
   */
  items: Wish[] = [];

  /**
   * @property creationButtons
   * @description Configuration for the creation buttons, including translated names and links.
   */
  creationButtons: { name: string; link: string; backgroundColor: string; color: string }[] = [];

  /**
   * @property langChangeSub
   * @description Subscription to the language change event, used to update creation button labels.
   */
  langChangeSub: Subscription;

  /**
   * @constructor
   * @param collectionsService - Service to fetch collections data.
   * @param router - Angular Router for navigation.
   * @param dialog - MatDialog service for opening confirmation dialogs.
   * @param translate - TranslateService for internationalization.
   * @param pdfExportService - PdfExportService for exportation of PDF files.
   */
  constructor(
    private collectionsService: CollectionsService,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService,
    private pdfExportService: PdfExportService
  ) {
    this.setCreationButtons();
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setCreationButtons();
    });
  }

  /**
   * @function setCreationButtons
   * @description Sets the configuration for the creation buttons, translating their names.
   * This is called on component initialization and on language change.
   */
  setCreationButtons(): void {
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

  /**
   * @function ngOnDestroy
   * @description Lifecycle hook that unsubscribes from the language change event
   * to prevent memory leaks when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  /**
   * @function ngOnInit
   * @description Lifecycle hook that triggers loading of collections when component initializes.
   */
  ngOnInit(): void {
    this.loadCollections();
  }


  /**
   * @function loadCollections
   * @description Fetches collections from the service and populates the `collections` array.
   * It specifically loads only top-level collections (where `idParentCollection` is 0)
   * and excludes those marked as `isInTrash`.
   */
  loadCollections(): void {
    this.collectionsService.getFullCollections().subscribe({
      next: (data: FullCollection[]) => {
        this.collections = data.filter(col => !col.isInTrash && col.idParentCollection === 0);
        console.log(this.collections);
      },
      error: (error) => {
        console.error('Error loading collections:', error);
      }
    });
  }

  /**
   * @function handleCollectionSelected
   * @description Handles the event when a collection is selected from the search bar autocomplete.
   * Navigates to the selected collection's detail page if it's a collection type.
   * @param result - The selected search result, conforming to the `SearchResult` interface.
   */
  handleCollectionSelected(result: SearchResult): void {
    if (result.type === 'collection') {
      this.navigateToCollection(result.id);
    } else {
      // Handle item selection if needed (e.g., navigate to item detail page)
    }
  }


  /**
   * @function deleteCollection
   * @description Handler to trigger deletion of a collection.
   * Opens a confirmation dialog with translated messages. If confirmed,
   * it performs a soft delete by setting `isInTrash` to true and updates the collection.
   * After deletion, it reloads the collections to update the view.
   * @param collection - The collection object to delete.
   */
  deleteCollection(collection: any): void {
    forkJoin({
      title: this.translate.get('itemsAction.deleteCollectionConfirmTitle'),
      message: this.translate.get('itemsAction.deleteCollectionConfirm', { title: collection.title })
    }).subscribe(translations => {
      const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
        data: {
          title: translations.title,
          message: translations.message
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
    });
  }

  /**
   * @function editCollection
   * @description Handler to trigger editing of a collection.
   * Redirects the user to the collection's edit page.
   * @param collection - The collection object to edit.
   */
  editCollection(collection: any): void {
    this.router.navigate(['/collections', collection.id, 'edit']);
  }

  /**
   * @function exportCollectionToPdf
   * @description Triggers the export of a given collection to a PDF file.
   * This method delegates the actual PDF generation to the `PdfExportService`.
   * @param collection - The collection object to be exported.
   */
  exportCollectionToPdf(collection: any): void {
    console.log('Exporting collection to PDF:', collection);
    this.pdfExportService.exportCollectionToPdf(collection);
  }

  /**
   * @function navigateToCollection
   * @description Navigates to the detail page of a specific collection.
   * @param id - The ID of the collection to navigate to.
   */
  navigateToCollection(id: number): void {
    this.router.navigate(['/collections', id]);
  }
}
