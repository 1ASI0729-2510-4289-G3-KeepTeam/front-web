import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {WishEditItemComponent} from './collections/pages/wish-edit-item-page/wish-edit-item.component';
import {WishQrShareComponent} from './collections/pages/wish-qr-share-page/wish-qr-share.component';
import {WishItemComponent} from './collections/pages/wish-item-page/wish-item.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, WishEditItemComponent, WishQrShareComponent, WishItemComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
