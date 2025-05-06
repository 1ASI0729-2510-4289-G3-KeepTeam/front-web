import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {WishEditItemComponent} from './collections/pages/wish-edit-item-page/wish-edit-item.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, WishEditItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
