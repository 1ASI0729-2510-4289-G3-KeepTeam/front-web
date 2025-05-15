import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {RouterLink} from '@angular/router';
import { Wish } from '../../model/wish.entity';
import {PopConfirmDialogComponent} from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CollectionsService} from '../../services/collections.service';

@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink,],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.css',
})
export class ItemActionsComponent {
  @Input() wish: Wish | undefined;

  constructor(
    private collectionsService: CollectionsService,
    private dialog: MatDialog
  ) {}

  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: { title: item.title },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Trying to delete ${item.title}`, result);
        item.isInTrash = true;
        console.log("¿Booleano antes de enviar?", typeof item.isInTrash, item.isInTrash);
        this.collectionsService.updateWish(item).subscribe(() => {
          history.back();
        });
      }
    });

}}
