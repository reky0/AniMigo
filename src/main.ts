import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const anilistLink = httpLink.create({
        uri: 'https://graphql.anilist.co' }
      );
      const animeThemesLink = httpLink.create({
        uri: 'https://graphql.animethemes.moe',
      });

      // Route based on operation name
      const link = split(
        ({ operationName }) => operationName.startsWith('AnimeThemes'),
        animeThemesLink, // if name starts with 'Theme'
        anilistLink       // otherwise use AniList
      );

      return {
        link: ApolloLink.from([link]),
        cache: new InMemoryCache(),
      }
    })
  ],
});
