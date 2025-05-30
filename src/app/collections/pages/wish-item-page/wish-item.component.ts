import {Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ItemActionsComponent } from '../../components/item-actions/item-actions.component';
import { MatButtonModule } from '@angular/material/button';
import {Wish} from '../../model/wish.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectionsService} from '../../services/collections.service';
import {MatDialog} from '@angular/material/dialog';
import { PopConfirmDialogComponent } from '../../../public/components/pop-confirm-dialog/pop-confirm-dialog.component';
import {Location} from '@angular/common';
import {TagListComponent} from '../../components/tags/tag-list.component';

/**
 * @component WishItemComponent
 * @description
 * Displays the details of a single Wish item fetched by productId from the route.
 * Includes UI elements like tag list and item actions.
 */
@Component({
  selector: 'app-wish-item',
  imports: [
    MatIconModule,
    ItemActionsComponent,
    MatButtonModule,
    TagListComponent,
  ],

  templateUrl: './wish-item.component.html',
  styleUrl: './wish-item.component.css',
})
export class WishItemComponent implements OnInit {
  /**
   * @property wishId
   * The productId extracted from the URL route parameters.
   */
  wishId: number | null = null;
  collectionId: string | null = null;
  /**
   * @property wish
   * The Wish object to display, fetched from the service.
   */
  wish: Wish | undefined = undefined;

  /**
   * @constructor
   * @param route ActivatedRoute for route parameters
   * @param dialog Service to fetch Wish details
   * @param collectionsService Service to fetch Wish details
   * @param router
   * @param location
   */
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private collectionsService: CollectionsService,
    private router: Router,
    private location: Location
  ) {}

  /**
   * @function ngOnInit
   * Fetches the productId from route params and loads Wish details if present.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => { // Use subscribe
      this.wishId = Number(params['productId']);
      this.collectionId = params['collectionId']; // Get collectionId from route
      if (this.wishId) {
        this.getWishDetails(this.wishId);
      }
    });
  }

  /**
   * @function getWishDetails
   * Fetches Wish details by ID and assigns it to the component property.
   * Ensures tags array exists to avoid null references.
   * @param id The Wish ID to fetch
   */
  getWishDetails(id: number): void {
    this.collectionsService.getWishById(id).subscribe({
      next: (data) => {
        this.wish = {
          ...data,
          tags: data.tags || [],
        };
        console.log(this.wish);
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  }

  /**
   * @function goBack
   * Navigates back in browser history.
   */
  goBack(): void {
    if (this.collectionId) {
      this.router.navigate(['/collections', this.collectionId]); // Navigate to collection
    } else {
      this.location.back(); // Fallback to history.back()
    }
  }

  /**
   * @function handleDelete
   * @description
   * Handles the deletion process of an item by showing a confirmation dialog.
   * If the user confirms, it performs a soft delete by setting `isInTrash` to true
   * and updating the item using the CollectionsService.
   *
   * @param item - The item object to be soft-deleted.
   */
  handleDelete(item: any) {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `¿Are you sure you want to delete ${item.title || item.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedItem = { ...item, isInTrash: true };
        this.collectionsService.updateWish(updatedItem).subscribe(() => {
          console.log('Item moved to trashcan');
        });
        history.back();
      }
    });

}
  shareWish(): void {
    if (this.wish) {
      this.router.navigate(['/share-settings'], {
        queryParams: {
          contentType: 'wish',
          itemId: this.wish.id,
          previousUrl: this.router.url // Asegúrate de pasar la URL actual
        }
      });
    }
  }


  shareWishQr(item: Wish | undefined): void { // Allow 'undefined'
    if (item) {
      this.router.navigate(['/share-qr'], {
        queryParams: {
          contentType: 'wish',
          itemId: item.id,
          previousUrl: this.router.url
        }
      });
    }
  }


}
