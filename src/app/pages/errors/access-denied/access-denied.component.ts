import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';


@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
 })
export class AccessDeniedComponent implements OnInit {

  public settings: Settings;
  constructor(public appSettings:AppSettings) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
