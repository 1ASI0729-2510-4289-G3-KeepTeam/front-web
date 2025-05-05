import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {CreationButtonsComponent} from './collections/components/creation-buttons/creation-buttons.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, CreationButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
