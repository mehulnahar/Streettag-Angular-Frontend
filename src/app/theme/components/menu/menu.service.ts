import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MenuItem } from './horizontal-menu/horizontal-menu.component';
import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems } from './menu';

@Injectable()
export class MenuService {
    constructor(private location: Location, private router: Router) { }

    public getVerticalMenuItems(): Menu[] {
        return verticalMenuItems;
    }

    public getHorizontalMenuItems(): MenuItem[] {
        return horizontalMenuItems.map(menu => ({
            id: menu.id,
            title: menu.title,
            routerLink: menu.routerLink || undefined,
            href: menu.href || undefined,
            icon: menu.icon || undefined,
            target: menu.target || undefined,
            hasSubMenu: menu.hasSubMenu,
            parentId: menu.parentId,
            type: menu.type || undefined,
            expanded: menu.expanded
        }));
    }

    private getMenuItems(): MenuItem[] {
        return [
            {
                id: 1,
                title: 'Dashboard',
                routerLink: '/dashboard',
                icon: 'dashboard',
                hasSubMenu: false,
                parentId: 0
            },
            {
                id: 2,
                title: 'Users',
                routerLink: '/users',
                icon: 'people',
                hasSubMenu: false,
                parentId: 0
            }
        ];
    }

    private convertToMenu(items: MenuItem[]): Menu[] {
        return items.map(item => new Menu(
            item.id,
            item.title,
            item.routerLink || null,
            item.href || null,
            item.icon || null,
            item.target || null,
            item.hasSubMenu,
            item.parentId,
            item.type || null,
            item.expanded || false
        ));
    }

    public expandActiveSubMenu(menu: Menu[]): void {
        let url = this.location.path();
        let routerLink = url;
        let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
        if (activeMenuItem[0]) {
            let menuItem = activeMenuItem[0];
            while (menuItem.parentId != 0) {
                let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
                menuItem = parentMenuItem;
                this.toggleMenuItem(menuItem.id);
            }
        }
    }

    public toggleMenuItem(menuId: number): void {
        const menuItem = document.getElementById('menu-item-' + menuId);
        const subMenu = document.getElementById('sub-menu-' + menuId);
        if (subMenu) {
            if (subMenu.classList.contains('show')) {
                subMenu.classList.remove('show');
                menuItem?.classList.remove('expanded');
            } else {
                subMenu.classList.add('show');
                menuItem?.classList.add('expanded');
            }
        }
    }

    public closeOtherSubMenus(menu: Menu[], menuId: number): void {
        const currentMenuItem = menu.filter(item => item.id == menuId)[0];
        if (currentMenuItem.parentId == 0 && !currentMenuItem.target) {
            menu.forEach(item => {
                if (item.id != menuId) {
                    const subMenu = document.getElementById('sub-menu-' + item.id);
                    const menuItem = document.getElementById('menu-item-' + item.id);
                    if (subMenu) {
                        if (subMenu.classList.contains('show')) {
                            subMenu.classList.remove('show');
                            menuItem?.classList.remove('expanded');
                        }
                    }
                }
            });
        }
    }

    public closeAllSubMenus(): void {
        const menu = document.getElementById("vertical-menu");
        if (menu) {
            for (let i = 0; i < menu.children[0].children.length; i++) {
                let child = menu.children[0].children[i];
                if (child) {
                    if (child.children[0].classList.contains('expanded')) {
                        child.children[0].classList.remove('expanded');
                        child.children[1].classList.remove('show');
                    }
                }
            }
        }
    }
}
