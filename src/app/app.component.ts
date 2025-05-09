import { Component } from '@angular/core';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';
import {LoginComponent} from './public/pages/login/login-content/login-content.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
