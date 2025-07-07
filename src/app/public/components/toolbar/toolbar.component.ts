import { Component } from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
/**
 * Top navigation toolbar component.
 * Provides access to navigation routes like the collections page.
 */
@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarRow,
    MatToolbar,
    MatIconModule,
    RouterLink,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  /**
   * Creates an instance of the toolbar component.
   *
   * @param router Used to programmatically navigate between application routes.
   */
  constructor(private router: Router) {}
  /**
   * Navigates to the collections page.
   */
  goToCollections() {
    this.router.navigate(['/collections']);
  }
}
