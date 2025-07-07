import { Component, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { CollectionsService } from '../../services/collections.service';
import {forkJoin, map, switchMap} from 'rxjs';
import { CommonModule } from '@angular/common';
import { PopConfirmDialogComponent } from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarComponent } from '../../../public/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Wish} from '../../model/wish.entity';
/**
 * TrashcanComponent
 *
 * Displays a table of trashed collections and wish items, allowing the user to restore or permanently delete them.
 */
@Component({
  selector: 'app-trashcan',
  standalone: true,
  imports: [
    MatTableModule,
    MatIcon,
    MatIconButton,
    CommonModule,
    MatButtonModule,
    ToolbarComponent,
    TranslatePipe
  ],
  templateUrl: './trashcan.component.html',
  styleUrl: './trashcan.component.css'
})
export class TrashcanComponent implements OnInit {

  constructor(
    private collectionService: CollectionsService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }
  /**
   * Lifecycle hook that runs after component initialization.
   */
  ngOnInit() {
    this.loadTrashItems();
  }
  /**
   * Table columns to be displayed.
   */

  displayedColumns: string[] = ['id', 'photo', 'title', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>();

  /**
   * @function loadTrashItems
   * @description Fetches trashed items and collections from the service and populates the table.
   */
  loadTrashItems() {
    this.collectionService.getCollections().pipe(
      switchMap((allCollections) => {
        const collectionIds = allCollections.map(c => c.id); // 🔁 busca en todas las colecciones

        const wishesRequests = collectionIds.map(id =>
          this.collectionService.getTrashedItemsByCollectionId(id) // este ya filtra items por trash
        );

        return forkJoin(wishesRequests).pipe(
          map((wishesPerCollection: Wish[][]) => {
            const allTrashedWishes = wishesPerCollection.flat();
            const trashedCollections = allCollections.filter(c => c.isInTrash); // ✅ solo las colecciones en papelera
            return { trashedCollections, allTrashedWishes };
          })
        );
      })
    ).subscribe(({ trashedCollections, allTrashedWishes }) => {
      const formattedItems = allTrashedWishes.map(item => ({ ...item, isCollection: false }));
      const formattedCollections = trashedCollections.map(col => ({ ...col, isCollection: true }));

      this.dataSource.data = [...formattedItems, ...formattedCollections];
    });
  }
  /**
   * Confirms and performs permanent deletion of a wish item or collection.
   *
   * @param element The item or collection to delete.
   */
  delete(element: any) {
    console.log('Eliminar:', element);


    forkJoin({
      title: this.translate.get('trashcanPage.confirmPermanentDeletion.title'),
      message: this.translate.get('trashcanPage.confirmPermanentDeletion.message', { title: element.title })
    }).subscribe(translations => {
      const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
        data: {
          title: translations.title,
          message: translations.message
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          if (!element.isCollection) {
            this.collectionService.deleteWish(element.id).subscribe(() => {
              console.log('Item deleted permanently');
              this.translate.get('trashcanPage.itemDeletedPermanently', { title: element.title }).subscribe(msg => {
                this.openSnackBar(msg);
              });
              this.loadTrashItems();
            });
          } else if (element.isCollection) {
            this.collectionService.deleteCollection(element.id).subscribe(() => {
              console.log('Collection deleted permanently');
              this.translate.get('trashcanPage.collectionDeletedPermanently', { title: element.title }).subscribe(msg => {
                this.openSnackBar(msg);
              });
              this.loadTrashItems();
            });
          }
        }
      });
    });
  }
  /**
   * Confirms and restores a trashed item or collection.
   *
   * @param element The item or collection to restore.
   */
  restore(element: any) {
    console.log('Recuperar:', element);


    forkJoin({
      title: this.translate.get('trashcanPage.confirmRestore.title'),
      message: this.translate.get('trashcanPage.confirmRestore.message', { title: element.title })
    }).subscribe(translations => {
      const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
        data: {
          title: translations.title,
          message: translations.message
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          if (!element.isCollection) {
            const updatedItem = { ...element, isInTrash: false };
            delete updatedItem.isCollection; // Eliminar propiedad temporal
            this.collectionService.updateWish(updatedItem).subscribe(() => {
              console.log('Item restored');
              this.translate.get('trashcanPage.itemRestored', { title: element.title }).subscribe(msg => {
                this.openSnackBar(msg);
              });
              this.loadTrashItems();
            });
          } else if (element.isCollection) {
            const updatedItem = { ...element, isInTrash: false };
            delete updatedItem.isCollection;
            this.collectionService.updateCollection(updatedItem).subscribe(() => {
              console.log('Collection restored');
              this.translate.get('trashcanPage.collectionRestored', { title: element.title }).subscribe(msg => {
                this.openSnackBar(msg);
              });
              this.loadTrashItems();
            });
          }
        }
      });
    });
  }
  /**
   * Displays a snackbar with a custom message.
   *
   * @param message The message to show in the snackbar.
   */
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      data: message,
    });
  }
}
