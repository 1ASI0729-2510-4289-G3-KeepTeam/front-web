import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
