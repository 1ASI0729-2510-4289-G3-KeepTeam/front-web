import {Component, OnInit} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {CollectionsService} from '../../services/collections.service';
import {forkJoin} from 'rxjs';
import {CommonModule} from '@angular/common';
import {PopConfirmDialogComponent} from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {SnackbarComponent} from '../../../public/components/snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-trashcan',
  imports: [
    MatTableModule,
    MatIcon,
    MatIconButton,
    CommonModule,
    MatButtonModule,
    ToolbarComponent
  ],
  templateUrl: './trashcan.component.html',
  styleUrl: './trashcan.component.css'
})
export class TrashcanComponent implements OnInit {

  constructor(
    private collectionService: CollectionsService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar ) { }

  ngOnInit(){
    this.loadTrashItems();
  }
  displayedColumns: string[] = ['id', 'photo', 'title', 'type', 'actions'];
  dataSource = new MatTableDataSource<any>();
  /**
   * @function loadCollections
   * @description Fetches collections from the service and maps them to the local collections array.
   */
  loadTrashItems(){
    forkJoin([
      this.collectionService.getTrashedItems(),
      this.collectionService.getTrashedCollections()
    ]).subscribe(([items, collections]) => {
      const formattedItems = items.map(item => ({ ...item, isCollection: false }));
      const formattedCollections = collections.map(col => ({ ...col, isCollection: true }));

      this.dataSource.data = [...formattedItems, ...formattedCollections];
    });
  }

  delete(element: any) {
    console.log('Eliminar:', element);

      const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
        data: {
          title: 'Confirm Permanent Deletion',
          message: `¿Are you sure you want to delete <strong>${element.title}</strong>?<br>After accepting you can't restore this element, it will be deleted permanently.`
            }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (!element.isCollection) {
          this.collectionService.deleteWish(element.id).subscribe(() => {
            console.log('Item deleted permanently');
            this.openSnackBar(`${element.title} deleted permanently.`);
            this.loadTrashItems()
          });
        } else if (element.isCollection) {
          this.collectionService.deleteCollection(element.id).subscribe(() => {
            console.log('Collection deleted permanently');
            this.openSnackBar(`${element.title} deleted permanently.`);
            this.loadTrashItems()
          });
        }

      }
    });
  }

  restore(element: any) {
    console.log('Recuperar:', element);
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: 'Confirm Restore',
        message: `¿Are you sure you want to restore <strong>${element.title}</strong>?<br>`
      }});

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if(!element.isCollection) {
          const updatedItem = { ...element, isInTrash: false };
          delete updatedItem.isCollection;
          this.collectionService.updateWish(updatedItem).subscribe(() => {
            console.log('Item restored');
            this.loadTrashItems()
          });
        }
        else if(element.isCollection) {
          const updatedItem = { ...element, isInTrash: false };
          delete updatedItem.isCollection;
          this.collectionService.updateCollection(updatedItem).subscribe(() => {
            console.log('Collection restored');
            this.openSnackBar(`${element.title} Restored`);
            this.loadTrashItems()
          });
        }

      }
    });
  }
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      data: message,
    });
  }
}
