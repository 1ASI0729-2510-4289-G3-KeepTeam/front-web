import { Routes } from '@angular/router';
import { CollectionProductsPageComponent } from './collections/pages/collection-products-page/collection-products-page.component';
import { CollectionsGridComponent } from './collections/pages/collections-grid/collections-grid.component';
import { CollectionEditComponent as CollectionEditPageComponent } from './collections/pages/collection-edit/collection-edit.component';
import { WishItemComponent } from './collections/pages/wish-item-page/wish-item.component';
import { WishEditItemComponent } from './collections/pages/wish-edit-item-page/wish-edit-item.component';
import { RouterModule } from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './public/pages/login/login-content/login-content.component';
import {SignUpComponent} from './public/pages/signUp/sign-up-content/sign-up-content.component';
import {UserProfileComponent} from './profiles/pages/user-profile/user-profile.component';
import {PlansContentComponent} from './public/pages/plans/plans-content/plans-content.component';
import {UserEditDialogComponent} from './profiles/pages/user-edit-dialog/user-edit-dialog.component';
import {UserEditCardComponent} from './profiles/pages/user-edit-card/user-edit-card.component';
import {UserEditPasswordComponent} from './profiles/pages/user-edit-password/user-edit-password.component';
import {ShareSettingsComponent} from './collections/pages/share-settings/share-settings.component';
import {LinkShareComponent} from './collections/pages/link-share-page/link-share.component';
import {QrShareComponent} from './collections/pages/qr-share-page/qr-share.component';
import {TrashcanComponent} from './collections/pages/trashcan/trashcan.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'collections',
    pathMatch: 'full',
  },
  {
    path: 'collections',
    component: CollectionsGridComponent,
  },
  {
    path: 'collections/user/:idUser',
    component: CollectionsGridComponent,
  },
  {
    path: 'collections/:id',
    component: CollectionProductsPageComponent,
  },
  {
    path: 'collections/:id/edit',
    component: CollectionEditPageComponent,
  },
  {
    path: 'collections/:collectionId/products/:productId',
    component: WishItemComponent,
  },
  {
    path: 'collections/:collectionId/:productId/edit',
    component: WishEditItemComponent,
  },
  {
    path: 'collections/:collectionId/products/:productId/edit',
    component: WishEditItemComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  {path: 'user-profile', component: UserProfileComponent },
  {path: 'plans', component: PlansContentComponent },
  {path: 'edit-profile', component: UserEditDialogComponent },
  {path: 'edit-card', component: UserEditCardComponent },
  {path: 'edit-password', component: UserEditPasswordComponent },
  { path: 'share-settings', component: ShareSettingsComponent },
  {path: 'link-share', component: LinkShareComponent },
  { path: 'collections/:collectionId/:productId', component: WishItemComponent },
  { path: 'share-qr', component: QrShareComponent },
  { path: 'trashcan', component: TrashcanComponent },
{ path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'collections/new/edit', component: CollectionEditPageComponent },
  { path: 'collections/:id/edit', component: CollectionEditPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
