import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Suppress Google Maps Marker deprecation warning
(window as any).google = (window as any).google || {};
(window as any).google.maps = (window as any).google.maps || {};
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Suppress Google Maps Marker deprecation warning
  if (typeof args[0] === 'string' && args[0].includes('google.maps.Marker is deprecated')) {
    return;
  }
  // Suppress Angular image dimension warning
  if (typeof args[0] === 'string' && args[0].includes('NG0913')) {
    return;
  }
  originalWarn.apply(console, args);
};

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
