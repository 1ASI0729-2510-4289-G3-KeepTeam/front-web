// src/app/public/components/entity-options-menu/entity-options-menu.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * @component EntityOptionsMenuComponent
 * @description
 * Generic component for displaying a MatMenu with common entity actions (edit, delete, share).
 * The available options depend on the provided `entityType`.
 */
@Component({
  selector: 'app-entity-options-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './entity-options-menu.component.html',
  styleUrl: './entity-options-menu.component.css',
})
export class EntityOptionsMenuComponent {
  /**
   * @input entityType
   * @description Specifies the type of entity ('wish' or 'collection') to determine menu options.
   */
  @Input() entityType: string = '';

  /**
   * @input entity
   * @description The actual entity object (Wish or Collection) that the actions pertain to.
   * This object is emitted back with the action.
   */
  @Input() entity: any;

  /**
   * @output action
   * @description Emits an object containing the `actionType` (e.g., 'edit', 'delete', 'shareLink', 'shareQr')
   * and the `entity` itself when a menu item is clicked.
   */
  @Output() action = new EventEmitter<{ actionType: string, entity: any }>();

  constructor() {}

  /**
   * @function onAction
   * @description Emits the selected action type along with the entity object.
   * Renamed from 'triggerAction' to 'onAction' to match the HTML.
   * @param actionType - The type of action to emit.
   */
  onAction(actionType: string): void {
    this.action.emit({ actionType, entity: this.entity });
  }

}
