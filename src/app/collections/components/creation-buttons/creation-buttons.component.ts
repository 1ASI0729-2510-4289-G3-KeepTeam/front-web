import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf} from '@angular/common';

/**
 * @component CreationButtonsComponent
 * @description This component renders a set of action buttons
 * used to add collections or sub-collections, each with its own
 * link and custom styling.
 */

@Component({
  selector: 'app-creation-buttons',
  imports: [MatButtonModule, NgForOf],
  templateUrl: './creation-buttons.component.html',
  styleUrl: './creation-buttons.component.css'
})
export class CreationButtonsComponent {

  /**
   * @property buttons
   * @description Array of button configurations, each containing:
   * - `name`: Display text for the button
   * - `link`: URL the button points to
   * - `backgroundColor`: Button background color
   * - `color`: Text color for the button
   */

  buttons = [
    {name: 'Add sub-collection', link: 'youtube.com', backgroundColor: '#FEDD72', color: '#BD6412'},
    {name: 'Add Collection', link: 'x.com', backgroundColor: '#FF8B68', color: '#FFFAF3'},
  ];
}

