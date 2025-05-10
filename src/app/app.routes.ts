import { Routes } from '@angular/router';
import { CollectionProductsPageComponent } from './collections/pages/collection-products-page/collection-products-page.component';
import { CollectionsGridComponent } from './collections/pages/collections-grid/collections-grid.component';
import { CollectionEditComponent as CollectionEditPageComponent } from './collections/pages/collection-edit/collection-edit.component';
import { WishItemComponent } from './collections/pages/wish-item-page/wish-item.component';
import { WishEditItemComponent } from './collections/pages/wish-edit-item-page/wish-edit-item.component';

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
    path: 'collections/user/:id',
    component: CollectionsGridComponent,
  },
  {
    path: 'collections/:id/products',
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
    path: 'collections/:collectionId/products/:productId/edit',
    component: WishEditItemComponent,
  },
];
