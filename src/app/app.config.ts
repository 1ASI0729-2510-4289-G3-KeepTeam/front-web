import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {authInterceptorFn} from './shared/interceptors/auth.interceptor';

/**
 * Factory function for creating a TranslateHttpLoader.
 * Loads translation files from the `./i18n/` folder with `.json` extension.
 *
 * @param http The Angular HttpClient instance.
 */
const httpLoaderFactory: (http: HttpClient) =>
  TranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');


import { routes } from './app.routes';
/**
 * Application configuration object.
 * Provides zone change detection, routing, HTTP client with interceptors,
 * and translation service setup.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en',
    })
  ],
};
