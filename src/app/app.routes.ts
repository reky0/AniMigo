import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'media/:type/:id',
    loadComponent: () => import('../app/components/pages/media-details-page/media-details-page.component').then( m => m.MediaDetailsPageComponent)
  },
];
