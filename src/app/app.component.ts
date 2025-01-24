import { AfterViewInit, ApplicationRef, Component} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import {CheckForUpdateService} from './check-for-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  public settings: Settings;
  constructor(public appSettings:AppSettings , private router: Router,
    private swPush: SwPush, private update : CheckForUpdateService){
      this.settings = this.appSettings.settings;
   
      // router.events.subscribe((routerEvent : any )=>{
      //   this.checkRouterEvent(routerEvent);
      // })
     
  } 

  ngOnInit() { 
    this.update.checkUpdate();
    //notification code not complete
    // this.swPush.requestSubscription({
    //   serverPublicKey: 'BFRBaFT0U8QeNAxQhxsega4e8Vffrw0z_Q3M3QlGT6Bv7UdYrchtyz0q3XMu9QwclbaNUOX6RfZu1jsPV7qUbJw'
    // })
    // .then(sub => console.log(JSON.stringify(sub)))
    // .catch(err => console.error("Could not subscribe to notifications", err));
    
    // this.swPush.messages.subscribe((message) => console.warn(message));
    
    // this.swPush.notificationClicks.subscribe(({ action, notification }) => {
    //   window.open(notification.data.url);
    // });
    

  }

  ngAfterViewInit(){
    this.update.updateClient();
  }

  // checkRouterEvent(routerEvent : Event):void {
  //   if(routerEvent instanceof NavigationStart){
  //       this.settings.loadingSpinner = true;
  //   }

  //   if(routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError){
  //     this.settings.loadingSpinner =  false;
       
  //   }
  // }

 

  

}