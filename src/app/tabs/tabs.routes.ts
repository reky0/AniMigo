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
          import('../components/pages/home-tab/home-tab.page').then((m) => m.HomeTabPage),
        title: 'Home · AniMigo',
      },
      {
        path: 'anime',
        loadComponent: () =>
          import('../components/pages/anime-tab/anime-tab.page').then((m) => m.AnimeTabPage),
        title: 'Anime · AniMigo',
      },
      {
        path: 'manga',
        loadComponent: () =>
          import('../components/pages/manga-tab/manga-tab.page').then((m) => m.MangaTabPage),
        title: 'Manga · AniMigo',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../components/pages/profile-tab/profile-tab.page').then((m) => m.ProfileTabPage),
        title: 'Profile · AniMigo',
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('../components/pages/explore-tab/explore-tab.page').then((m) => m.ExploreTabPage),
        title: 'Explore · AniMigo',
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
