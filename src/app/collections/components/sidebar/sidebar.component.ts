import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // nav = [
  //   {
  //     name: 'Dog Things',
  //     items: [
  //       { name: 'Dog bed', link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoNQWiJJy-Z360Hc6d07zViBvCudiZUHWcBQ&s' },
  //       { name: 'dog food', link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoNQWiJJy-Z360Hc6d07zViBvCudiZUHWcBQ&s'},
  //       { name: 'perro peruano', link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOdQAXzPAjKTSs-IfZFPqSoEfaCbAcd9H8Hw&s' }
  //     ]
  //   },
  // ];


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
