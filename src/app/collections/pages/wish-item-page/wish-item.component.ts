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
import {TranslatePipe} from '@ngx-translate/core';
import {ToolbarComponent} from "../../../public/components/toolbar/toolbar.component";

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
    TranslatePipe,
    ToolbarComponent,
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

  /**
   * @property collectionId
   * The ID of the collection to which this wish item belongs, extracted from route parameters.
   */
  collectionId: string | null = null;

  /**
   * @property wish
   * The Wish object to display, fetched from the service.
   */
  wish: Wish | undefined = undefined;

  /**
   * @constructor
   * @param route - ActivatedRoute for accessing route parameters.
   * @param dialog - MatDialog service for opening dialogs (e.g., confirmation dialog).
   * @param collectionsService - Service to fetch and update Wish details.
   * @param router - Angular Router for programmatic navigation.
   * @param location - Location service for interacting with the browser's history.
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
   * @description Fetches the productId and collectionId from route parameters and
   * loads Wish details if productId is present.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.wishId = Number(params['productId']);
      this.collectionId = params['collectionId'];
      if (this.wishId) {
        this.getWishDetails(this.wishId);
      }
    });
  }

  /**
   * @function getWishDetails
   * @description Fetches Wish details by ID from the collections service and assigns
   * it to the component's `wish` property. Ensures the tags array exists to avoid null references.
   * @param id - The ID of the Wish to fetch.
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
   * @description Navigates back to the collection page if `collectionId` is available,
   * otherwise navigates back in browser history.
   */
  goBack(): void {
    if (this.collectionId) {
      this.router.navigate(['/collections', this.collectionId]);
    } else {
      this.location.back();
    }
  }

  /**
   * @function handleDelete
   * @description Handles the deletion process of an item by showing a confirmation dialog.
   * If the user confirms, it performs a soft delete by setting `isInTrash` to true
   * and updating the item using the CollectionsService.
   * @param item - The item object to be soft-deleted.
   */
  handleDelete(item: any): void {
    const dialogRef = this.dialog.open(PopConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${item.title || item.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedItem = { ...item, isInTrash: true };
        this.collectionsService.updateWish(updatedItem).subscribe(() => {
          console.log('Item moved to trashcan');
        });
        history.back(); // Navigate back after deletion
      }
    });
  }

  /**
   * @function shareWish
   * @description Handles the action to share the wish link.
   * Navigates to the '/link-share' page, passing the wish's `redirectUrl`
   * and other relevant information as query parameters.
   */
  shareWish(): void {
    if (this.wish) {
      const shareableLink = this.wish.redirectUrl;

      if (!shareableLink || shareableLink.trim() === '') {
        console.warn('The wish does not have a valid redirectUrl to share the link:', this.wish);
        return;
      }

      this.router.navigate(['/link-share'], {
        queryParams: {
          link: shareableLink,
          contentType: 'wish',
          itemId: this.wish.id,
          returnUrl: this.router.url
        }
      });
    }
  }

  /**
   * @function shareWishQr
   * @description Handles the action to share the wish via a QR code.
   * Navigates to the '/share-qr' page, passing the wish's ID and content type
   * to generate the QR code.
   * @param item - The Wish object for which to generate the QR code.
   */
  shareWishQr(item: Wish | undefined): void {
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
