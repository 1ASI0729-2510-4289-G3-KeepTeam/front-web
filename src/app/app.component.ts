import { Component } from '@angular/core';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { RouterOutlet } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';
/**
 * Root component of the application.
 * Initializes language settings and renders global layout components like the toolbar and router outlet.
 */
@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, RouterOutlet, LanguageSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'front-end';
  /**
   * Creates an instance of the root component and sets up translation defaults.
   *
   * @param translate Translation service for handling multiple languages.
   */
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
