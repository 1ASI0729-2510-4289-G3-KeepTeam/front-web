import { Component } from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

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
  constructor(private router: Router) {}

  goToCollections() {
    this.router.navigate(['/collections']);
  }
}
