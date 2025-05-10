import { Routes } from '@angular/router';
import { CollectionProductsPageComponent } from './collections/pages/collection-products-page/collection-products-page.component';
import { CollectionsGridComponent } from './collections/pages/collections-grid/collections-grid.component';

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
    path: 'collections/:id/products',
    component: CollectionProductsPageComponent,
  },
];
