// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://streettag-env-24-clone.phq3pps4xm.eu-west-2.elasticbeanstalk.com/api/admin/',  // Update this with your actual API base URL
  userUrl: 'http://streettag-env-24-clone.phq3pps4xm.eu-west-2.elasticbeanstalk.com/api/',
  googleMapsApiKey: 'AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
