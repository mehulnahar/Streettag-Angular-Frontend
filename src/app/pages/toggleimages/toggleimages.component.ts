import { Component, OnInit,Inject } from '@angular/core';
import {AjaxService} from '../../ajax.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DeleteDialog} from '../../deletedialog/deletedialog.component';

import { MatSnackBar } from '@angular/material/snack-bar';

declare var $:any;
@Component({
  selector: 'app-toggleimages',
  templateUrl: './toggleimages.component.html',
  styleUrls: ['./toggleimages.component.scss']
})
export class ToggleimagesComponent implements OnInit {
  allimgs = [] as any;
  imgs = [] as any;
  img:any;
  delresult:any;

  public viewType:string = 'grid';
  constructor( private ajaxService: AjaxService, public dialog: MatDialog,public snackBar: MatSnackBar) {
  this.img="http://185.106.129.16:1337/ImagesFiles/";

   }

  ngOnInit() {
    $('#spinner').show();
    
    var thisone = this;
             setTimeout(function(){
              thisone.getimages();
         $('#spinner').hide();
        },2000);

    
  }
  public changeView(viewType){
    this.viewType = viewType;}


  getimages()
  {

  
      //console.log("here in getgallery");
   
 var url = "http://185.106.129.16:1337/fitnessApp/getCoupon";
     var datac = {"app_id":"24"};
   this.ajaxService.post(datac, url).subscribe(
     data => {
       //console.log(data);
       //('run');
       this.allimgs = data;
      //console.log(this.allimgs);
      
     },
     error => { 
       //console.error("Error in calling get orders");
       
     }
   );
  }




  
openDeleteDialog(id): void {
  let dialogRef = this.dialog.open(DeleteDialog , {
    data: { name:"" }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.delresult=result;
    if(this.delresult=="1")
    this.delete(id);
  });
}



  delete(cou_id)
  {

  
      //console.log("here in delete coupon"+cou_id);
   
 var url = "http://185.106.129.16:1337/fitnessApp/deleteCoupon";
     var datac = {"app_id":"24","manager_id":"1141","coupon_id":cou_id};
   this.ajaxService.post(datac, url).subscribe(
     data => {
       //console.log(data);
       //('run');
       this.imgs = data;
       this.getimages();
       this.snackBar.open('נמחק בהצלחה!', null, {
        duration: 1700,
        verticalPosition: 'top' });
     },
     error => { 
       //console.error("Error in calling get orders");
       
     }
   );
  }



  openDialog(): void {
  
    let dialogRef = this.dialog.open(DialogOverviewCouponDialog, {
      data: {   }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getimages();
    });
  }

}




@Component({
  selector: 'dialog-overview-coupon-dialog',
  templateUrl: 'dialog-overview-coupon-dialog.html',
})
export class DialogOverviewCouponDialog {
  edit=0;
  resData: any; 
  message : any;
  group: any;
  allgroups: any;
  image: any;
  img:any;
  tt: any;
  t:number;
  vendorid:any;
  timestmp: any;
  public imageSrc: string = '';
  filesToUpload: File = null;
  public files: any[];
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewCouponDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ajaxService: AjaxService,public snackBar: MatSnackBar) {
     // var flag = "1";
     // this.tt=data.timestmp;
     this.message=data.text;
     this.image=data.image;
     this.group=data.group;
     this.allgroups
     this.vendorid=data.vendor_id
     
  this.img="http://185.106.129.16:1337/ImagesFiles/";
     

     }

  onNoClick(): void {
    this.dialogRef.close();
  }


  

  handleInputChange(e) {
  
    this.tt = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14); 
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      // ('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.image = reader.result;
    //console.log(this.imageSrc)
    this.edit=1;

  var s=this.image.length;
  this.img= this.image.slice(22, s);
 //console.log("on uploading"+this.tt);
  var url = "http://185.106.129.16:1337/fitnessApp/UploadIOS";
  var data = {
    "app_id":"24",
    "manager_id":"1141",
    "image":this.img,
        "timestamp":this.tt,
        "upload_type":"coupon"

  };
  
   this.ajaxService.post(data, url).subscribe(
    data => {
      this.resData = data;
      //console.log(data);
      if(this.resData.status=="true"){
        //console.log("true");
       // this.getImages(id);
      }else{
        (this.resData.msg);

      }
    },
    error => { 
      //console.error("Error");
      
    }
  );
  }
  
  upload()
  {
 
    //console.log("submit function"+this.group);
    this.t=parseInt(this.tt);
   this.timestmp = [{timestampId:this.t}]
   //console.log("on submitting"+this.timestmp);
   var url = "http://185.106.129.16:1337/fitnessApp/addCoupon";
  var datac = {
    "app_id":"24",
    "manager_id":"1141",
      "coupon_name": "schoolapp",
    "timestamp":JSON.stringify(this.timestmp),
    
  };
  
   this.ajaxService.post(datac, url).subscribe(
    data => {
      this.resData = data;
      //console.log(data);
      if(this.resData.status=="true"){
        //console.log("true");
        this.snackBar.open('נוצר בהצלחה!', null, {
          duration: 1700,
          verticalPosition: 'top' });
       // this.getImages(id);
      }else{
        (this.resData.msg);

      }
    },
    error => { 
      //console.error("Error");
      
    }
  );
  this.dialogRef.close();
  }


  cancel()
  {
    this.dialogRef.close();
  }


}