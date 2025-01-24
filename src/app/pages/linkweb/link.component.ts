import { Component, Inject } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {DeleteDialog} from '../../deletedialog/deletedialog.component';
declare var $: any;


@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {

  delresult:any;
  dynamiclinks=[] as any;
  public single: any[];
  public multi: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Country';
  public showYAxisLabel = true;
  public yAxisLabel = 'Population';
 
  resData: Object;
  is_edit: boolean=true; 
  link: any;
  newlink:any;


  ngOnInit(): void {
   
    $('#spinner').show();
    
    var thisone = this;
       
       setTimeout(function(){
        thisone.getLink()
         $('#spinner').hide();
        },2000);

   
  }


  
  public settings: Settings;

  constructor(public appSettings:AppSettings, private ajaxService: AjaxService, public dialog: MatDialog,public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings; 
     
  }


  /// method to get link
  getLink(){
  
    var url = "http://185.106.129.16:1337/fitnessApp/getDynamicLinkMoshe";
    var data = {"app_id":"24","manager_id":"1141","group_id":"0","dyn_link_code":"2401"};
       this.ajaxService.post(data, url).subscribe(
      data => {
     this.dynamiclinks = data;
       
        return this.dynamiclinks;

      })
    
  }


  ////method to delete link
  openDeleteDialog(): void {
    let dialogRef = this.dialog.open(DeleteDialog , {
      data: { name:"" }
    });

    dialogRef.afterClosed().subscribe(result => {
  

      this.delresult=result;
      if(this.delresult=="1")
      this.deletelink();
    });
  }

  deletelink() {
         
    var url = "http://185.106.129.16:1337/fitnessApp/deleteDynamicLinkMoshe";
    var data = {"manager_id":"1141","app_id":"24","dyn_link_code":"2401"};
      this.ajaxService.post(data, url).subscribe(
      data => {
        this.resData = data;
      
        this. getLink();
        this.snackBar.open('נמחק בהצלחה!', null, {
          duration: 1700,
          verticalPosition: 'top' });
     
      },
      error => { 
        //console.error("Error");
        this.snackBar.open('שגיאה!', null, {
          duration: 1700,
          verticalPosition: 'top' });
      }
    );
     
    }





    ///// method to edit link
    editlink() {
    
      this.newlink  = $("#aboutus1").val();
     
    var url = "http://185.106.129.16:1337/fitnessApp/updateDynamicLinkMoshe";
    var data = {"manager_id":"1141","app_id":"24","link_url":this.newlink,"dyn_link_code":"2401"};
      this.ajaxService.post(data, url).subscribe(
      data => {
        this.resData = data;
        this.getLink()      
        this.is_edit=true;
       
        this.snackBar.open('עודכן בהצלחה!', null, {
          duration: 1700,
          verticalPosition: 'top' });
     
      },
      error => { 
        //console.error("Error");
        this.snackBar.open('שגיאה!', null, {
          duration: 1700,
          verticalPosition: 'top' });
        
      }
    );
      this. getLink();
    
    }


enableedit()
{
  this.is_edit=false;
}




}
