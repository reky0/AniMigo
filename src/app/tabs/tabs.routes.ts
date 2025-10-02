import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../components/organisms/home-tab/home-tab.page').then((m) => m.HomeTabPage),
      },
      {
        path: 'anime',
        loadComponent: () =>
          import('../components/organisms/anime-tab/anime-tab.page').then((m) => m.AnimeTabPage),
      },
      {
        path: 'manga',
        loadComponent: () =>
          import('../components/organisms/manga-tab/manga-tab.page').then((m) => m.MangaTabPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../components/organisms/profile-tab/profile-tab.page').then((m) => m.ProfileTabPage),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('../components/organisms/explore-tab/explore-tab.page').then((m) => m.ExploreTabPage),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
