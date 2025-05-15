import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
/**
 * @component SidebarComponent
 * @description
 * Component of sidebar menu displaying user collections.
 * Each collection is rendered with its name and a linked image preview.
 */

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  /**
   * @property nav
   * @description
   * Navigation structure for the sidebar. Contains a list of grouped items
   * where each item represents a user collection with a name and image URL.
   */
  nav = [
    {
      name: 'My Collections',
      items: [
        { name: 'Dog things', link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoNQWiJJy-Z360Hc6d07zViBvCudiZUHWcBQ&s' },
        { name: 'Bedroom Dec', link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoNQWiJJy-Z360Hc6d07zViBvCudiZUHWcBQ&s'},
        { name: 'Art Stuff', link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOdQAXzPAjKTSs-IfZFPqSoEfaCbAcd9H8Hw&s' }
      ]
    },
  ];
}
