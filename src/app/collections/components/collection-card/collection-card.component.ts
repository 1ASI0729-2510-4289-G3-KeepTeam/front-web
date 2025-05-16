import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgForOf, NgStyle, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import {ShareSettingsComponent} from '../../pages/share-settings/share-settings.component';

/**
 * @component CollectionCardComponent
 * @description This component represents a visual card for a collection,
 * displaying its name, image, and tags, along with an options menu to view, edit,
 * share, or delete the collection.
 */

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [NgForOf, NgIf, MatChipsModule, NgClass, NgStyle, MatIconModule, MatButtonModule, MatMenuModule, ShareSettingsComponent],
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css'],
})
export class CollectionCardComponent {

  /**
   * @constructor
   * @param router - Angular Router used for navigation.
   */


  sharingType: 'link' | 'qr' | null = null;
  qrCodeContent: string = '';


  constructor(private router: Router) {}


  /**
   * @input name
   * @description Name of the collection to be displayed.
   */
  @Input() name: string = '';

  /**
   * @input imageUrls
   * @description Array of image URLs associated with the collection.
   */
  @Input() imageUrls: string[] = [];

  /**
   * @input tags
   * @description Tags to display for the collection, each with a name and color.
   */
  @Input() tags: { name: string; color: string }[] = [];

  /**
   * @input collection
   * @description The collection object. Can be strongly typed if available.
   */
  @Input() collection: any;

  /**
   * @output delete
   * @description Emits an event when the collection is deleted.
   */
  @Output() delete = new EventEmitter<any>();

  /**
   * @output edit
   * @description Emits an event when the edit action is triggered.
   */
  @Output() edit = new EventEmitter<any>();

  /**
   * @output share
   * @description Emits an event when the share action is triggered.
   */
  @Output() share = new EventEmitter<any>();

  /**
   * @output view
   * @description Emits an event when the collection is viewed.
   */
  @Output() view = new EventEmitter<void>();

  /**
   * @function displayedTags
   * @description Returns the first three tags to be displayed on the card.
   * @returns {Array<{ name: string; color: string }>}
   */

  @Output() shareQr = new EventEmitter<any>();

  get displayedTags(): { name: string; color: string }[] {
    return this.tags.slice(0, 3);
  }

  /**
   * @function onDelete
   * @description Emits the delete event with the collection object.
   */
  onDelete(): void {
    this.delete.emit(this.collection);
  }
  /**
   * @function onEdit
   * @description Navigates to the collection with the id edit page.
   */
  onEdit(): void {
    this.router.navigate(['/collections', this.collection.id, 'edit']);
  }

  /**
   * @function onShare
   * @description Emits the share event with the collection object.
   */
  onShare(): void {
    this.share.emit(this.collection);
  }

  /**
   * @function onView
   * @description Emits the view event when the collection is viewed.
   */
  onView(): void {
    this.view.emit();
  }

  onShareLink(): void {
    this.router.navigate(['/share-settings'], {
      queryParams: { // Usamos queryParams
        contentType: 'collection',
        itemId: this.collection.id,
        previousUrl: this.router.url
      }
    });
  }

  onShareQr(): void {
    this.shareQr.emit(this.collection);
  }
}
