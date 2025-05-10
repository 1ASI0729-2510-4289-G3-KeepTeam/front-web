import { Component } from '@angular/core';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    ToolbarComponent,
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
