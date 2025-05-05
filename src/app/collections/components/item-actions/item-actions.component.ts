import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-item-actions',
  imports: [
    MatIconModule,
    MatButton
  ],
  templateUrl: './item-actions.component.html',
  styleUrl: './item-actions.component.css'
})
export class ItemActionsComponent{

}
