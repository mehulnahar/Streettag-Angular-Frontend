export class Settings {
    constructor(
        public name: string,
        public loadingSpinner: boolean,
        public fixedHeader: boolean,
        public fixedSidenav: boolean,
        public fixedSidenavUserContent: boolean,
        public fixedFooter: boolean,
        public sidenavIsOpened: boolean,
        public sidenavIsPinned: boolean,
        public menuType: 'default' | 'compact' | 'mini' | 'vertical' | 'horizontal',
        public theme: string,
        public isRTL: boolean
    ) { }
} 