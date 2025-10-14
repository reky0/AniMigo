import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'media/:type/:id',
    loadComponent: () => import('./components/pages/media-details/media-details.page').then( m => m.MediaDetailsPageComponent)
  },
];
