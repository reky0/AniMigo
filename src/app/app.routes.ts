import { Routes } from '@angular/router';
import { TopMediaConfig } from './models/top-media-config.interface';

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
    loadComponent: () => import('./components/pages/top-media/top-media.page').then( m => m.TopMediaPage),
    data: {
      config: {
        titlePrefix: 'Top 100',
        sortType: ['SCORE_DESC'],
        maxItems: 100,
        typeSource: 'route',
        defaultHref: '/explore'
      } as TopMediaConfig
    }
  },
  {
    path: ':type/top-popular',
    loadComponent: () => import('./components/pages/top-media/top-media.page').then( m => m.TopMediaPage),
    data: {
      config: {
        titlePrefix: 'Top Popular',
        sortType: ['POPULARITY_DESC'],
        typeSource: 'route',
        defaultHref: '/explore'
      } as TopMediaConfig
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
    loadComponent: () => import('./components/pages/top-media/top-media.page').then( m => m.TopMediaPage),
    data: {
      config: {
        titlePrefix: 'Top Movies',
        sortType: ['SCORE_DESC'],
        format: 'MOVIE',
        typeSource: 'fixed',
        fixedType: 'anime',
        defaultHref: '/explore'
      } as TopMediaConfig
    }
  },
];
