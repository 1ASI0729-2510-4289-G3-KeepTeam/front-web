import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {Tag} from '../../model/tag.entity';
import { EntityOptionsMenuComponent } from '../../../public/components/entity-options-menu/entity-options-menu.component';
import {Wish} from '../../model/wish.entity';

/**
 * @component ProductItemCardComponent
 * @description This component displays an item as a card,
 * including an image, title, description, and an optional link to view more details.
 */
@Component({
  selector: 'app-product-item-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatChip,
    MatChipSet,
    EntityOptionsMenuComponent
  ],
  templateUrl: './product-item-card.component.html',
  styleUrl: './product-item-card.component.css',
})
export class ProductItemCardComponent {
  /**
   * @input imageUrl
   * @description URL of the image displayed at the top of the card.
   */
  @Input() imageUrl: string = '';
  /**
   * @input tags
   * @description Tags array of a wish / item.
   */
  @Input() tags?: Tag[];

  /**
   * @input title
   * @description Title or name of the product/item.
   */
  @Input() title: string = '';

  /**
   * @input description
   * @description Short description or details about the item.
   */
  @Input() description: string = '';

  /**
   * @input link
   * @description URL to navigate to for more details or actions related to the item.
   * This input is no longer used directly for card navigation,
   * but is kept for compatibility if needed elsewhere.
   */
  @Input() link: number = 0;

  /**
   * @input item
   * @description The full item object, passed to the options menu and used for navigation.
   * It must contain 'id' (the product ID) and 'collectionId' for navigation to work.
   */
  @Input() item: any;

  /**
   * @output delete
   * @description Emits an event when the item is deleted.
   */
  @Output() delete = new EventEmitter<any>();

  /**
   * @output edit
   * @description Emits an event when the edit action is triggered.
   */
  @Output() edit = new EventEmitter<any>();

  /**
   * @output shareQr
   * @description Emits an event when the share QR action is triggered.
   */
  @Output() shareQr = new EventEmitter<any>();

  /**
   * @output shareLink
   * @description Emits an event when the share link action is triggered.
   */
  @Output() shareLink = new EventEmitter<any>();


  protected readonly String = String;

  /**
   * @constructor
   * @param router - Angular Router service for navigation.
   */
  constructor(private router: Router) { }

  /**
   * @function handleItemAction
   * @description Handles actions emitted by the EntityOptionsMenuComponent.
   * Dispatches the corresponding event based on the action type.
   * @param event - Object containing `actionType` (string) and `entity` (any).
   */
  handleItemAction(event: { actionType: string, entity: any }): void {
    const { actionType, entity } = event;

    switch (actionType) {
      case 'delete':
        this.delete.emit(entity);
        break;
      case 'edit':
        this.edit.emit(entity);
        break;
      case 'shareQr':
        this.shareQr.emit(entity);
        break;
      case 'shareLink':
        this.shareLink.emit(entity);
        break;
    }
  }

  /**
   * @function navigateToItem
   * @description Navigates to the item's detail page when the card is clicked.
   * Requires `item.id` and `item.collectionId` to be present for successful navigation.
   */
  navigateToItem(): void {
    if (this.item && this.item.id && this.item.collectionId) {
      this.router.navigate(['/collections', this.item.collectionId, this.item.id]);
    } else {
      console.warn(
        'ProductItemCardComponent: Cannot navigate to item. Missing item.id or item.collectionId in "item" input.',
        'Current "item" object:', this.item,
        'Expected route:', '/collections/:collectionId/:productId'
      );
    }
  }
}
