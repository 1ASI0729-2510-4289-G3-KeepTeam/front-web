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
   * @description tags array of a wish / item.
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
   * Este input ya no se usa directamente para la navegación de la tarjeta,
   * pero se mantiene por compatibilidad si lo necesitas en otro lugar.
   */
  @Input() link: number = 0;

  /**
   * @input item
   * @description The full item object, passed to the options menu y usado para la navegación.
   * Debe contener 'id' (el ID del producto) y 'idCollection' para que la navegación funcione.
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
   * @param router - Servicio Router de Angular para navegación.
   */
  constructor(private router: Router) { }

  /**
   * @function handleItemAction
   * @description Handles actions emitted by the EntityOptionsMenuComponent.
   * @param event - Object containing actionType and entity.
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
   * @description Navega a la página de detalles del ítem cuando la tarjeta es clickeada.
   */
  navigateToItem(): void {
    if (this.item && this.item.id && this.item.collectionId) {
      this.router.navigate(['/collections', this.item.collectionId, this.item.id]);
    } else {
      console.warn(
        'ProductItemCardComponent: No se puede navegar al ítem. Falta item.id o item.idCollection en el input "item".',
        'Objeto "item" actual:', this.item,
        'Ruta esperada:', '/collections/:collectionId/:productId'
      );
    }
  }
}
