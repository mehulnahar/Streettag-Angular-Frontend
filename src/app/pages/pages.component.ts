import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { rotate } from '../theme/utils/app-animation';
import { MenuService } from '../theme/components/menu/menu.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [ rotate ],
  providers: [ MenuService ]
})
export class PagesComponent implements OnInit { 
  @ViewChild('sidenav', { static: false }) sidenav:any;  
  @ViewChildren(CdkScrollable) scrollables!: QueryList<CdkScrollable>;
  
  public settings: Settings;
  public showSidenav: boolean = false;
  public showInfoContent: boolean = false;
  public toggleSearchBar: boolean = false;
  public menuType: 'default' | 'compact' | 'mini' | 'vertical' | 'horizontal' = 'vertical';
  public menus = ['vertical', 'horizontal'];

  constructor(
    public appSettings: AppSettings, 
    public router: Router, 
    private menuService: MenuService
  ) {        
    this.settings = this.appSettings.settings;
  }
  
  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.fixedSidenav = false;
    }
    this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems());
  }

  ngAfterViewInit(){
    setTimeout(() => { this.settings.loadingSpinner = false }, 300); 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(window.innerWidth <= 768){
          this.settings.sidenavIsOpened = false;
        }
      }
    });
  }

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public chooseMenu(){
    this.settings.menuType = this.menuType;
  }

  public changeTheme(theme: string){
    this.settings.theme = theme;       
  }
  
  public closeInfoContent(showInfoContent: boolean){
    this.showInfoContent = !showInfoContent;
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.fixedSidenav = false;
    } else {
      this.settings.sidenavIsOpened = true;
      this.settings.fixedSidenav = true;
    }
  }

  public closeSubMenus(){
    if(this.settings.menuType === 'vertical'){
      this.menuService.closeAllSubMenus();
    }      
  }
}