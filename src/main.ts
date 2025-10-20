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

import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

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

      return {
        link: ApolloLink.from([anilistLink]),
        cache: new InMemoryCache(),
      }
    })
  ],
});

addIcons(allIcons);
