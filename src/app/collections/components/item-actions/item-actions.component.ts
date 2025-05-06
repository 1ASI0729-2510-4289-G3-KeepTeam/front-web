import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-item-actions',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.css'
})
export class ItemActionsComponent{

}
