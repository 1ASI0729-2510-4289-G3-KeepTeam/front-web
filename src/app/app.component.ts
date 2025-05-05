import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {CollectionsGridComponent} from './collections/pages/collections-grid/collections-grid.component';

@Component({
  selector: 'app-root',
  imports: [
    ToolbarComponent,
    CollectionsGridComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
