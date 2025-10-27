import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthService } from './app/components/core/services/auth.service';

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
      const authService = inject(AuthService);

      // Create the HTTP link to AniList API
      const anilistLink = httpLink.create({
        uri: 'https://graphql.anilist.co'
      });

      // Create auth link to add authorization headers
      const authLink = setContext((_, { headers }) => {
        const token = authService.getToken();

        // Return the headers with authorization if token exists
        return {
          headers: {
            ...headers,
            ...(token ? {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            } : {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            })
          }
        };
      });

      return {
        link: ApolloLink.from([authLink, anilistLink]),
        cache: new InMemoryCache(),
      }
    })
  ],
});

addIcons(allIcons);
