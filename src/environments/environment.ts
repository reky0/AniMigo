// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  anilistClientIdWeb: '31298', // Replace with your actual client ID from https://anilist.co/settings/developer
  anilistClientIdApp: '31655', // Replace with your actual client ID from https://anilist.co/settings/developer
  anilistRedirectUriWeb: 'http://localhost:8100/auth/callback',
  anilistRedirectUriApp: 'animigo://auth/callback'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
