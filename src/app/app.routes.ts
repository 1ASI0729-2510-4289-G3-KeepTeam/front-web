import {provideRouter, Routes} from '@angular/router';
import {WishItemComponent} from './collections/pages/wish-item-page/wish-item.component';
import {WishQrShareComponent} from './collections/pages/wish-qr-share-page/wish-qr-share.component';
import {ApplicationConfig} from '@angular/core';
import {WishShareSettingsComponent} from './collections/pages/wish-share-settings/wish-share-settings.component';
import {WishLinkShareComponent} from './collections/pages/wish-link-share/wish-link-share.component';
export const routes: Routes = [
  { path: 'wish/:id', component: WishItemComponent },
  { path: 'wish-qr-share/:id', component: WishQrShareComponent },
  { path: 'wish/share/:id', component: WishShareSettingsComponent },
  { path: 'wish/link/:id', component: WishLinkShareComponent },
  { path: '', redirectTo: '/some-default-path', pathMatch: 'full' },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
