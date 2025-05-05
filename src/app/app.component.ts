import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {WishItemComponent} from './collections/pages/wish-item-page/wish-item.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, WishItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
