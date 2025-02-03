export class Menu {
    constructor(
        public id: number,
        public title: string,
        public routerLink: string | null = null,
        public href: string | null = null,
        public icon: string | null = null,
        public target: string | null = null,
        public hasSubMenu: boolean = false,
        public parentId: number = 0,
        public type: string | null = null,
        public expanded: boolean = false
    ) { }
} 