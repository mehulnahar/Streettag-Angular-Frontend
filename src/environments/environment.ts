// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = { 
  
  production: false,
  
  baseUrl : 'http://52.56.93.181:3000/api/admin/',
  userUrl : 'http://52.56.93.181:3000/api/'

  // baseUrl : 'http://streettag-env-linux2-clone.eu-west-2.elasticbeanstalk.com/api/admin/',
  // userUrl : 'http://streettag-env-linux2-clone.eu-west-2.elasticbeanstalk.com/api/'

  // baseUrl :'https://wearestreettag.co.uk/api/admin/',
  // userUrl : 'https://wearestreettag.co.uk/api/'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
