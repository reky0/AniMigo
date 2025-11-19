import { Routes } from '@angular/router';
import { MediaListConfig } from './models/media-list-config.interface';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'media/:type/:id',
    loadComponent: () => import('./components/pages/media-details/media-details.page').then( m => m.MediaDetailsPageComponent),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./components/pages/calendar/calendar.page').then( m => m.CalendarPage),
    title: 'Calendar · AniMigo',
  },
  {
    path: ':type/top-100',
    loadComponent: () => import('./components/pages/media-list/media-list.page').then( m => m.MediaListPage),
    data: {
      config: {
        titlePrefix: 'Top 100',
        sortType: ['SCORE_DESC'],
        maxItems: 100,
        typeSource: 'route',
        defaultHref: '/explore'
      } as MediaListConfig
    }
  },
  {
    path: ':type/top-popular',
    loadComponent: () => import('./components/pages/media-list/media-list.page').then( m => m.MediaListPage),
    data: {
      config: {
        titlePrefix: 'Top Popular',
        sortType: ['POPULARITY_DESC'],
        typeSource: 'route',
        defaultHref: '/explore'
      } as MediaListConfig
    }
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./components/pages/auth-callback/auth-callback.page').then(m => m.AuthCallbackPage),
    title: 'Authenticating · AniMigo',
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/pages/settings/settings.page').then( m => m.SettingsPage),
    title: 'Settings · AniMigo',
  },
  {
    path: 'anime/top-movies',
    loadComponent: () => import('./components/pages/media-list/media-list.page').then( m => m.MediaListPage),
    data: {
      config: {
        titlePrefix: 'Top Movies',
        sortType: ['SCORE_DESC'],
        format: 'MOVIE',
        typeSource: 'fixed',
        fixedType: 'anime',
        defaultHref: '/explore'
      } as MediaListConfig
    }
  },
  {
    path: ':type/upcoming',
    loadComponent: () => import('./components/pages/media-list/media-list.page').then( m => m.MediaListPage),
    data: {
      config: {
        titlePrefix: 'Upcoming',
        typeSource: 'route',
        sortType: ['POPULARITY_DESC'],
        status: 'NOT_YET_RELEASED',
        defaultHref: '/explore'
      } as MediaListConfig
    }
  },
  {
    path: 'anime/airing',
    loadComponent: () => import('./components/pages/media-list/media-list.page').then( m => m.MediaListPage),
    data: {
      config: {
        titlePrefix: 'Airing',
        typeSource: 'fixed',
        fixedType: 'anime',
        sortType: ['POPULARITY_DESC'],
        status: 'RELEASING',
        defaultHref: '/explore'
      } as MediaListConfig
    }
  },
  {
    path: 'manga/publishing',
    loadComponent: () => import('./components/pages/media-list/media-list.page').then( m => m.MediaListPage),
    data: {
      config: {
        titlePrefix: 'Publishing',
        typeSource: 'fixed',
        fixedType: 'manga',
        sortType: ['POPULARITY_DESC'],
        status: 'RELEASING',
        defaultHref: '/explore'
      } as MediaListConfig
    }
  },
  {
    path: 'explore/season-list',
    loadComponent: () => import('./components/pages/season-list/season-list.page').then(m => m.SeasonListPage),
  },
  // Add this wildcard route at the END
  {
    path: '**',
    loadComponent: () => import('./components/pages/not-found-404/not-found-404.page').then(m => m.NotFound404Page)
  }
];
