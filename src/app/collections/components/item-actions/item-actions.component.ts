import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {RouterLink} from '@angular/router';
import { Wish } from '../../model/wish.entity';
import {PopConfirmDialogComponent} from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CollectionsService} from '../../services/collections.service';

/**
 * @component ItemActionsComponent
 * @description This component provides action buttons for deleting, editing and sharing
 * for a specific item. It allows users to interact with the item,
 * such as confirming and performing a soft delete.
 */

@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink,],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.css',
})
export class ItemActionsComponent {
  /**
   * @input wish
   * @description The item (Wish) that this component provides actions for.
   */
  @Input() wish: Wish | undefined;
  /**
   * @constructor
   * @param collectionsService - Service for handling collection-related logic, including updating wishes.
   * @param dialog - Angular Material dialog service used to open confirmation dialogs.
   */
  constructor(
    private collectionsService: CollectionsService,
    private dialog: MatDialog
  ) {}
  /**
   * @function openDeleteDialog
   * @description Opens a confirmation dialog to delete an item. If confirmed,
   * it flags the item as trashed and updates it through the service.
   * @param item - The item to be marked as deleted.
   */
  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: { title: item.title },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Trying to delete ${item.title}`, result);
        item.isInTrash = true;
        this.collectionsService.updateWish(item).subscribe(() => {
          history.back();
        });
      }
    });

}}
