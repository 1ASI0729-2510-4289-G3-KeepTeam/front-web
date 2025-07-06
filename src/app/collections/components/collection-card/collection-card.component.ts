import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgForOf, NgStyle, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {EntityOptionsMenuComponent} from '../../../public/components/entity-options-menu/entity-options-menu.component';

/**
 * @component CollectionCardComponent
 * @description This component represents a visual card for a collection,
 * displaying its name, image, and tags, along with an options menu to view, edit,
 * share, or delete the collection.
 */
@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [NgForOf, NgIf, MatChipsModule, NgClass, NgStyle, MatIconModule, MatButtonModule, EntityOptionsMenuComponent],
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css'],
})
export class CollectionCardComponent {

  /**
   * @constructor
   * @param router - Angular Router used for navigation.
   */
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
   * @input isSubCollection
   * @description A boolean indicating if the current collection is a sub-collection.
   */
  @Input() isSubCollection: boolean = false;

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
   * @output exportPdf
   * @description Emits an event when the export PDF action is triggered.
   */
  @Output() exportPdf  = new EventEmitter<any>();

  /**
   * @output view
   * @description Emits an event when the collection is viewed.
   */
  @Output() view = new EventEmitter<void>();

  /**
   * @function displayedTags
   * @description Returns the first three tags to be displayed on the card.
   * @returns {Array<{ name: string; color: string }>} An array containing the first three tags.
   */
  get displayedTags(): { name: string; color: string }[] {
    return this.tags.slice(0, 3);
  }

  /**
   * @function handleCollectionAction
   * @description Handles actions emitted from the `EntityOptionsMenuComponent`.
   * Dispatches the corresponding action (delete, edit, exportPdf) based on the `actionType`.
   * @param event - An object containing the `actionType` (string) and the `entity` (any) to act upon.
   */
  handleCollectionAction(event: { actionType: string, entity: any }): void {
    console.log('--- Inside handleCollectionAction in CollectionCardComponent ---');
    console.log('Action event RECEIVED from entity-options-menu:', event);

    const { actionType, entity } = event;

    switch (actionType) {
      case 'delete':
        this.onDelete(entity);
        break;
      case 'edit':
        this.onEdit();
        break;
      case 'exportPdf':
        this.onExportPdf(entity);
        break;
    }
  }

  /**
   * @function onDelete
   * @description Emits the delete event with the collection object.
   * @param collection - The collection object to be deleted.
   */
  onDelete(collection: any): void {
    this.delete.emit(collection);
  }

  /**
   * @function onEdit
   * @description Navigates to the edit page for the current collection, identified by its ID.
   */
  onEdit(): void {
    this.router.navigate(['/collections', this.collection.id, 'edit']);
  }

  /**
   * @function onExportPdf
   * @description Emits the exportPdf event with the collection object,
   * typically to trigger a PDF export action in the parent component.
   * @param collection - The collection object to be exported to PDF.
   */
  onExportPdf(collection: any): void {
    console.log('--- Inside onExportPdf in CollectionCardComponent (before emitting exportPdf) ---');
    console.log('Collection to be emitted to parent (CollectionProductsPageComponent):', collection);
    this.exportPdf.emit(collection);
  }

  /**
   * @function onView
   * @description Emits the view event when the collection card is clicked to view its contents.
   */
  onView(): void {
    this.view.emit();
  }
}
