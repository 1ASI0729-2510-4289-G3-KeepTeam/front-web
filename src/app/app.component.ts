import { Component } from '@angular/core';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { CollectionsPageComponent } from './collections/pages/collections-page/collections-page.component';
// import { CollectionsGridComponent } from './collections/pages/collections-grid/collections-grid.component';
import { CollectionCardComponent } from './collections/components/collection-card/collection-card.component';

@Component({
  selector: 'app-root',
  imports: [
    ToolbarComponent,
    CollectionsPageComponent,
    // CollectionsGridComponent,
    CollectionCardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'front-end';
}
