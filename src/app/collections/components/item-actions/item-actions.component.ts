import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

/**
 * @component ItemActionsComponent
 * @description This component provides action buttons for deleting, editing and sharing
 * for a specific item. It allows users to interact with the item,
 * such as confirming and performing a soft delete.
 */

@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, MatMenuTrigger, MatMenu, MatMenuItem,],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.css',
})
export class ItemActionsComponent {
  /**
   * @input item
   * The item object (can be a wish, collection, etc.) on which actions will be performed.
   */
  @Input() item: any;

  /**
   * @output onShare
   * You can use placeholder segments like ':id' that will be replaced dynamically.
   */
  @Output() onShare = new EventEmitter<void>();

  /**
   * @output shareQr  <--------------------- THIS IS THE IMPORTANT PART
   * Emits the item when the share as QR action is triggered.
   */
  @Output() shareQr = new EventEmitter<any>();

  /**
   * @input editRoute
   * Accepts placeholders like ':id', ':collectionId' that are replaced using the item.
   */
  @Input() editRoute?: any[];

  /**
   * @output onDelete
   * Emits the current item when the delete action is triggered.
   */
  @Output() onDelete = new EventEmitter();

  constructor(private router: Router) {}

  /**
   * @function buildRoute
   * @description
   * Builds a concrete route from a route template by replacing any placeholder segments (e.g., ':id')
   * with actual values from the `item` object.
   * @param route - An array of route segments (strings).
   * @returns {any[]} A new route array with values replaced where applicable.
   */


  buildRoute(route: any[] | undefined): any[] {
    if (!route) return [];
    return route.map(segment => {
      if (typeof segment === 'string' && segment.startsWith(':')) {
        const key = segment.substring(1);
        return (this.item as any)[key] ?? segment;
      }
      return segment;
    });
  }

  onShareLink(): void {
    this.onShare.emit(); // Emit the share event
  }

  onShareQr(): void { // Corrected function name
    console.log('onShareQr function in ItemActionsComponent called', this.item);
    this.shareQr.emit(this.item);
  }

}
