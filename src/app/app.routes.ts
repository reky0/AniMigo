import { Routes } from '@angular/router';

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
    loadComponent: () => import('./components/pages/top-100/top-100.page').then( m => m.Top100Page),
  },
  {
    path: ':type/top-popular',
    loadComponent: () => import('./components/pages/top-popular/top-popular.page').then( m => m.TopPopularPage)
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
];
