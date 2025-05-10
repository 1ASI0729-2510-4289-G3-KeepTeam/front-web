import { Component } from '@angular/core';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { RouterOutlet } from '@angular/router';
import { CollectionProductsPageComponent } from './collections/pages/collection-products-page/collection-products-page.component';
// import { CollectionsGridComponent } from './collections/pages/collections-grid/collections-grid.component';
// import { CollectionsPageComponent } from './collections/pages/collections-page/collections-page.component';
import { CollectionEditComponent } from './collections/pages/collection-edit/collection-edit.component';

@Component({
  selector: 'app-root',
  imports: [
    ToolbarComponent,
    CollectionEditComponent,
    RouterOutlet,
    // CollectionProductsPageComponent,
    // CollectionsGridComponent,
    // CollectionsPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'front-end';
}
