import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {Tag} from '../../model/tag.entity';
/**
 * @component ProductItemCardComponent
 * @description This component displays an item as a card,
 * including an image, title, description, and an optional link to view more details.
 */
@Component({
  selector: 'app-product-item-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, MatChip, MatChipSet],
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
   */
  @Input() link: number = 0;

  protected readonly String = String;
}
