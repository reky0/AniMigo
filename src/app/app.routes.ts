import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home-tab',
    loadComponent: () => import('./components/pages/home-tab/home-tab.page').then( m => m.HomeTabPage)
  },
  {
    path: 'anime-tab',
    loadComponent: () => import('./components/pages/anime-tab/anime-tab.page').then( m => m.AnimeTabPage)
  },
  {
    path: 'manga-tab',
    loadComponent: () => import('./components/pages/manga-tab/manga-tab.page').then( m => m.MangaTabPage)
  },
  {
    path: 'profile-tab',
    loadComponent: () => import('./components/pages/profile-tab/profile-tab.page').then( m => m.ProfileTabPage)
  },
  {
    path: 'explore-tab',
    loadComponent: () => import('./components/pages/explore-tab/explore-tab.page').then( m => m.ExploreTabPage)
  },
  {
    path: 'anime-details',
    loadComponent: () => import('./components/pages/anime-details/anime-details.page').then( m => m.AnimeDetailsPage)
  },
  {
    path: 'manga-details',
    loadComponent: () => import('./components/pages/manga-details/manga-details.page').then( m => m.MangaDetailsPage)
  },
  {
    path: 'manga',
    loadComponent: () => import('./components/pages/manga/manga.page').then( m => m.MangaPage)
  },
  {
    path: 'anime',
    loadComponent: () => import('./components/pages/anime/anime.page').then( m => m.AnimePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/pages/profile/profile.page').then( m => m.ProfilePage)
  },
];
