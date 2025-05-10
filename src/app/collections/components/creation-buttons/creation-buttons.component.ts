import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf} from '@angular/common';
@Component({
  selector: 'app-creation-buttons',
  imports: [MatButtonModule, NgForOf],
  templateUrl: './creation-buttons.component.html',
  styleUrl: './creation-buttons.component.css'
})
export class CreationButtonsComponent {
  buttons = [
    {name: 'Add sub-collection', link: 'youtube.com', backgroundColor: '#FEDD72', color: '#BD6412'},
    {name: 'Add Collection', link: 'x.com', backgroundColor: '#FF8B68', color: '#FFFAF3'},
  ];
}

