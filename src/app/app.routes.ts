import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home-tab',
    loadComponent: () => import('./components/organisms/home-tab/home-tab.page').then( m => m.HomeTabPage)
  },
  {
    path: 'anime-tab',
    loadComponent: () => import('./components/organisms/anime-tab/anime-tab.page').then( m => m.AnimeTabPage)
  },
  {
    path: 'manga-tab',
    loadComponent: () => import('./components/organisms/manga-tab/manga-tab.page').then( m => m.MangaTabPage)
  },
  {
    path: 'profile-tab',
    loadComponent: () => import('./components/organisms/profile-tab/profile-tab.page').then( m => m.ProfileTabPage)
  },
  {
    path: 'explore-tab',
    loadComponent: () => import('./components/organisms/explore-tab/explore-tab.page').then( m => m.ExploreTabPage)
  },
];
