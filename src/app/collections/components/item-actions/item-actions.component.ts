import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * @component ItemActionsComponent
 * @description This component provides action buttons for deleting, editing and sharing
 * for a specific item. It allows users to interact with the item,
 * such as confirming and performing a soft delete.
 */

@Component({
  selector: 'app-item-actions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuTrigger, MatMenu, MatMenuItem, TranslatePipe,],
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
   * @output shareQr
   * Emits the item when the share as QR action is triggered.
   */
  @Output() shareQr = new EventEmitter<any>();

  /**
   * @output onDelete
   * Emits the current item when the delete action is triggered.
   */
  @Output() onDelete = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * @function editRoute
   * @description
   * Routing to edit page of current page
   */
  editRoute(){
    let baseRouteSegments = this.route.snapshot.url;
    let baseRoute = ''
    console.log('Segments: ', baseRouteSegments);
    for(let segment in baseRouteSegments) {
      baseRoute = baseRoute + '/' + baseRouteSegments[segment].path;
      console.log(baseRoute);
    }
    console.log('Final:', baseRoute);
    this.router.navigate([baseRoute, 'edit']);
  }

  onShareLink(){
    this.onShare.emit();
  }

  onShareQr(){
    console.log('onShareQr function in ItemActionsComponent called', this.item);
    this.shareQr.emit(this.item);
  }

  deleteEntity(event: MouseEvent){
    event.stopPropagation();
    this.onDelete.emit(this.item);
  }
}
