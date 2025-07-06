import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';

/**
 * @component ItemActionsComponent
 * @description This component provides action buttons for deleting, editing, and sharing
 * a specific item. It allows users to interact with the item,
 * such as confirming and performing a soft delete.
 */
@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuTrigger, MatMenu, MatMenuItem, TranslatePipe, NgIf,],
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
   * @input isCollectionContext
   * @description If true, this component is used in the context of a Collection,
   * showing the PDF export option instead of regular share options.
   */
  @Input() isCollectionContext: boolean = false;


  @Input() showPdfExportButton: boolean = true;


  /**
   * @output onExportPdf
   * Emits the item when the export PDF action is triggered.
   */
  @Output() onExportPdf = new EventEmitter<any>();

  /**
   * @output onDelete
   * Emits the current item when the delete action is triggered.
   */
  @Output() onDelete = new EventEmitter();

  /**
   * @output onCopyLink
   * Emits the current item when the copy link action is triggered.
   */
  @Output() onCopyLink = new EventEmitter<any>();

  /**
   * @output onShareQr
   * Emits the current item when the share via QR code action is triggered.
   */
  @Output() onShareQr = new EventEmitter<any>();


  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * @function editRoute
   * @description
   * Navigates to the edit page of the current item or collection.
   * Constructs the route based on the current URL segments.
   */
  editRoute(): void {
    const baseRouteSegments = this.route.snapshot.url;
    let baseRoute = '';
    console.log('Segments: ', baseRouteSegments);
    for (const segment of baseRouteSegments) {
      baseRoute = baseRoute + '/' + segment.path;
      console.log(baseRoute);
    }
    console.log('Final:', baseRoute);
    this.router.navigate([baseRoute, 'edit']);
  }

  /**
   * @function deleteEntity
   * @description
   * Emits the current item to initiate the deletion process.
   * Stops the propagation of the DOM event to prevent unwanted behavior.
   * @param event - The mouse event that triggered the action, used to stop propagation.
   */
  deleteEntity(event: MouseEvent): void {
    event.stopPropagation();
    this.onDelete.emit(this.item);
  }

  /**
   * @function onExportPdfAction
   * @description
   * Emits the current item to initiate the PDF export action.
   * Stops the propagation of the DOM event.
   * @param event - The mouse event that triggered the action, used to stop propagation.
   */
  onExportPdfAction(event: MouseEvent): void {
    event.stopPropagation();
    this.onExportPdf.emit(this.item);
  }

  /**
   * @function copyLinkAction
   * @description
   * Emits the current item to initiate the copy link action.
   * Stops the propagation of the DOM event.
   * @param event - The mouse event that triggered the action, used to stop propagation.
   */
  copyLinkAction(event: MouseEvent): void {
    event.stopPropagation();
    this.onCopyLink.emit(this.item);
  }

  /**
   * @function shareQrAction
   * @description
   * Emits the current item to initiate the share via QR code action.
   * Stops the propagation of the DOM event.
   * @param event - The mouse event that triggered the action, used to stop propagation.
   */
  shareQrAction(event: MouseEvent): void {
    event.stopPropagation();
    this.onShareQr.emit(this.item);
  }
}
