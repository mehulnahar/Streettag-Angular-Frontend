import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';

export interface MenuItem {
  id: number;
  title: string;
  routerLink?: string;
  href?: string;
  target?: string;
  hasSubMenu: boolean;
  parentId: number;
  icon?: string;
  type?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class HorizontalMenuComponent implements OnInit {
  @Input() menuParentId: number = 0;
  public menuItems: MenuItem[] = [];
  public settings: Settings;
  
  constructor(public appSettings: AppSettings, public menuService: MenuService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.menuItems = this.menuService.getHorizontalMenuItems();
    this.menuItems = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }
}