import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ItemActionsComponent} from '../../components/item-actions/item-actions.component';

@Component({
  selector: 'app-wish-item',
  imports: [
    MatIconModule,
    ItemActionsComponent,
  ],
  templateUrl: './wish-item.component.html',
  styleUrl: './wish-item.component.css'
})
export class WishItemComponent {
}
