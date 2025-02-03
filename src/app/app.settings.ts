import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';

@Injectable({
    providedIn: 'root'
})
export class AppSettings {
    public settings = new Settings(
        'StreetTag',       // name
        true,             // loadingSpinner
        true,             // fixedHeader
        true,             // fixedSidenav
        false,            // fixedSidenavUserContent
        false,            // fixedFooter
        true,             // sidenavIsOpened
        true,             // sidenavIsPinned
        'vertical',       // menuType
        'default',        // theme
        false            // isRTL
    );
} 