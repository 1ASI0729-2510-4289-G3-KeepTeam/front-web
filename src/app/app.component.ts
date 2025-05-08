import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {CollectionEditComponent} from './collections/pages/collection-edit/collection-edit.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, CollectionEditComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
