import {Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ItemActionsComponent } from '../../components/item-actions/item-actions.component';
import { MatButtonModule } from '@angular/material/button';
import { TagListComponent } from '../../../public/components/tags/tag-list.component';
import {Wish} from '../../model/wish.entity';
import {ActivatedRoute} from '@angular/router';
import {CollectionsService} from '../../services/collections.service';
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
  wishId: string | null = null;

  /**
   * @property wish
   * The Wish object to display, fetched from the service.
   */
  wish: Wish | undefined = undefined;

  /**
   * @constructor
   * @param route ActivatedRoute for route parameters
   * @param wishService Service to fetch Wish details
   */
  constructor(
    private route: ActivatedRoute,
    private wishService: CollectionsService
  ) {}

  /**
   * @function ngOnInit
   * Fetches the productId from route params and loads Wish details if present.
   */
  ngOnInit(): void {
    this.wishId = this.route.snapshot.paramMap.get('productId');

    if (this.wishId) {
      this.getWishDetails(this.wishId);
    }
  }

  /**
   * @function getWishDetails
   * Fetches Wish details by ID and assigns it to the component property.
   * Ensures tags array exists to avoid null references.
   * @param id The Wish ID to fetch
   */
  getWishDetails(id: string): void {
    this.wishService.getWishById(id).subscribe({
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
    history.back();
  }
}
