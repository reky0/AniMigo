import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'anime/:id',
    loadComponent: () => import('./components/pages/anime-details/anime-details.page').then( m => m.AnimeDetailsPage)
  },
  {
    path: 'manga/:id',
    loadComponent: () => import('./components/pages/manga-details/manga-details.page').then( m => m.MangaDetailsPage)
  }
];
