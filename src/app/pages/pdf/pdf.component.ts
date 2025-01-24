import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import {DeleteDialog} from '../../deletedialog/deletedialog.component';

declare var $: any;
@Component({
  selector: 'app-mailbox',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  encapsulation: ViewEncapsulation.None
 
})
export class PdfComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;

  pdfList=[] as any;

  sendmsg=[] as any;
  MsgGroup=[] as any;
  groupList=[] as any;
  public settings: Settings;
  public sidenavOpen:boolean = true;
  public mails: any;
  public mail: any;
  public newMail: boolean;
  public type:string = 'all';
  public showSearch:boolean = false;
  public searchText: string;
  public form:FormGroup;
  allmsg=[] as any;
  pdfdata=[] as any;
  message: any;
  group_id: any;
  glist: any;
  resData: any;
  tt:any;
  upload_type:any;

  public show_dialog : boolean = false;
  public button_name : any = 'Show Login Form!';
  ts: any;
  pdf_id: any;
  msg: any;
  t: number;
  x:number;
  timestmp: { timestampId: any; }[];
  imageSrc: any;
  image: any;
  files: any;
  selectedFiles: any;
  currentFileUpload: any;
  newtimestamp: any;
  message1: any;
  delresult:any;
  


  constructor(public appSettings:AppSettings, 
              public formBuilder: FormBuilder, 
              public snackBar: MatSnackBar,
              public dialog: MatDialog, 
              private ajaxService: AjaxService) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.getMails();    
    this.x=0;  
    if(window.innerWidth <= 992){
      this.sidenavOpen = false;
    }
    $('#spinner').show();
    
    var thisone = this;
             setTimeout(function(){
              thisone.getMsggroups()
              thisone.getgroupList()
              thisone.viewDetail(this.glist);
              thisone.getpdf();
         $('#spinner').hide();
        },2000);





   
    this.form = this.formBuilder.group({
      'to': ['', Validators.required],
      'cc': null,
      'subject': null,    
      'message': null
    });  
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth <= 992) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public getMails(){
    
  }

  public viewDetail(glist){

    //console.log("group id is")
    //console.log(glist)


        var getdata = {};
    var url = "http://185.106.129.16:1337/fitnessApp/getMessages";
    //console.log("(inside 1)")


    var data = {"app_id":"24","group_id":glist};
    //console.log(data)


    //console.log("(inside 2)")

    // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
    // var arr1 = {"requestData" : arr};
    this.ajaxService.post(data, url).subscribe(


      data => {
        //console.log("(inside 3)")

        this.allmsg = data;

        //console.log("(inside 4)")

        //console.log("messages are:");
             //console.log(this.allmsg)

        //console.log("(inside 5)")


        
      })

     
    return this.allmsg;

    }

  public compose(){
    this.mail = null;
    this.newMail = true;
  }

  public setAsRead(){
    this.mail.unread = false;
  }

  public setAsUnRead(){
    this.mail.unread = true;
  }

  public delete() {
    this.mail.trash = true;
    this.mail.sent = false;
    this.mail.draft = false; 
    this.mail.starred = false; 
    this.getMails();
    this.mail = null;
  }

  public changeStarStatus() {       
    this.mail.starred = !this.mail.starred;
    this.getMails(); 
  }

  public restore(){
    this.mail.trash = false;
    this.type = 'all';
    this.getMails();
    this.mail = null; 
  }

  public onSubmit(mail){
    //console.log(mail)
    if (this.form.valid) {
      this.snackBar.open('Mail sent to ' + mail.to + ' successfully!', null, {
        duration: 2000,
      });
        
    }
  }

  getgroupList(){
    var getdata = {};
           var url = "http://185.106.129.16:1337/fitnessApp/groupList";
    var data = {"app_id":"24"};
    // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
    // var arr1 = {"requestData" : arr};
    this.ajaxService.post(data, url).subscribe(
      data => {
        this.groupList = data;

        //console.log("grouplist is:")
        //console.log(data);
        return this.groupList;

      })
    
  }


  getMsggroups(){

    //console.log("here here here")
    var getdata = {};
           var url = "http://185.106.129.16:1337/fitnessApp/messagesGroup";
    var data = {"app_id":"24"};
    // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
    // var arr1 = {"requestData" : arr};
    this.ajaxService.post(data, url).subscribe(
      data => {
        this.MsgGroup = data;

        //console.log("msg groups are:")
        //console.log(this.MsgGroup);
        return this.MsgGroup;

      })
    
  }
         addMsg()
        {
           //console.log("Calling Function........")
           this.message=this.message;
           //console.log("message is")
           //console.log(this.message)


           this.group_id=this.group_id;

           //console.log("group id is:")
            //console.log(this.group_id)  
            
         var url = "http://185.106.129.16:1337/fitnessApp/managerSendMessage";
             var data = {"app_id":"24","manager_id":"1141","message":this.message,"group_id":this.group_id};
             //console.log("***********************")
           
             //console.log("query is:")
             //console.log(data)
             //console.log("***********************")
           
             // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
             // var arr1 = {"requestData" : arr};
             this.ajaxService.post(data, url).subscribe(
               data => {
                 this.sendmsg = data;
                 this.getgroupList()
                 //console.log("request result is:");
          //console.log(this.sendmsg);

               
                 return this.sendmsg;
           
               })

                       

    }

/////////////////////////////pdf///////////////////////////////////////////////////

  
    public deleteMessage(id,_gid) {
     
//console.log("gid is:"+_gid)
//console.log(id)



      var getdata = {};
      var url = "http://185.106.129.16:1337/fitnessApp/deleteMessages";
      var data = {"manager_id":"1141","app_id":"24","message_id":id};

      //console.log(data)
        this.ajaxService.post(data, url).subscribe(
        data => {
          this.resData = data;
          //console.log(data);
          if(this.resData.status=="true"){
            //console.log("true");
         this.viewDetail(this._gid)
        
          }else{
    
          }
        },
        error => { 
          //console.error("Error");
          
        }
      );
      }


////////////////////get pdf list//////////////////////////


getpdf(){
  //console.log("iside get pdf")
  var getdata = {};
         var url = "http://185.106.129.16:1337/fitnessApp/pdfList_ByGroup";
  var data = {"app_id":"24","group_id":"0"};
  // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
  // var arr1 = {"requestData" : arr};
  this.ajaxService.post(data, url).subscribe(
    data => {
    this.pdfList = data;

      //console.log("pdflit show:")
      //console.log(data);
      return this.pdfList;

    })
  
}

////////////////////Add new Pdf////////////////////////////


// handleInputChange(e) {
//   this.tt = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14); 
//   var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
//   var pattern = /pdf-*/;
//   var reader = new FileReader();
//   if (!file.type.match(pattern)) {
//     return;
//   }
//   reader.onload = this._handleReaderLoaded.bind(this);
//   reader.readAsDataURL(file);
// }
// _handleReaderLoaded(e) {
//   let reader = e.target;
//   this.imageSrc = reader.result;
//   this.image = reader.result;
//   //console.log(this.imageSrc)
// }

resetFormData(){
  //console.log("calling reset function")
  $('#form_id').trigger('#pdf-form');
 
  $('#pdf-form')[0].reset();
}


onFileChanged(event: any) 
{
  
  //console.log("CALLING FUNCTION 11111111111111111111");

  //console.log(event);
  
  this.files = event.target.files;
  //console.log(this.files);
 
   this.tt = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14); 
  //console.log("time stamp"+this.tt);
 
//console.log(this.files[0].name);
//console.log(this.files[0]);
  
const formData = new FormData();
var thisone = this;
  formData.append('pdfUploader', this.files[0]);
 
  formData.append("upload_type", "pdfUzan");
  formData.append("timestamp", this.tt);
  formData.append("app_id", "24");
  formData.append("manager_id", "1141");
  //console.log(JSON.stringify(formData))

  formData.forEach((value,key) => {
     //console.log(key+" "+value)
   });
  this.pdfupload(formData);
 
  
  
////console.log(formData);  

}

pdfupload(formData)
{
  //console.log("CALLING FUNCTION 222222222222222222221");

  const form = formData;

  
  //console.log(form)
  var url = "http://185.106.129.16:1337/fitnessApp/uploadPdfschoolAppIos";
  
  this.ajaxService.postone(form, url).subscribe(
    data => {
      this.resData = data;
        this.newtimestamp=this.resData.timestamp;
    
      //console.log(this.newtimestamp);
      if(this.resData.status=="true"){
        //console.log("true");
        this.x=1;
       // this.getImages(id);
      }else{
       

      }
    },
    error => { 
      //console.error("Error");
      //console.log(error);
    }
  );
    

}


setPdfData()
{

  //console.log("Calling Function...33333333333333.....")
 

  this.upload_type = "pdfUzan"

var url = "http://185.106.129.16:1337/fitnessApp/uploadPdfIosData";
         var data = {"upload_type":this.upload_type,"app_id":"24", "manager_id":"1141", "pdf":this.newtimestamp, "timestamp":this.newtimestamp};
         //console.log("***********************")
       
         //console.log("query is:")
         //console.log(data)
         //console.log("***********************")
       
         // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
         // var arr1 = {"requestData" : arr};
       this.ajaxService.post(data, url).subscribe(
      data => {
       this.resData = data;
       this.getpdf();

// this.getLink()
//console.log("result is:"+this.resData);


// this.is_edit=true;

//console.log(this.resData);


},
error => { 
//console.error("Error");

}
);


}


createPdf(){
  this.setPdfData()


  if(this.message1&&this.x)
  {
  //console.log("CALLING FUNCTION 444444444444444444444");

 
        //console.log("Calling Function........")
           
              this.message1=this.message1;
               //console.log("message is:"+this.message)

               //console.log("time stamp is:"+this.newtimestamp)


               this.ts=parseInt(this.newtimestamp);
               this.timestmp = [{timestampId:this.ts}]

               var url = "http://185.106.129.16:1337/fitnessApp/createPDF";
               var data = {"app_id":"24", "group_id":"0", "manager_id":"1141", "file_desc":this.message1, "timestamp":JSON.stringify(this.timestmp)};
               //console.log("***********************")
             
               //console.log("query is:")
               //console.log(data)
               //console.log("***********************")
             
               // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
               // var arr1 = {"requestData" : arr};
             this.ajaxService.post(data, url).subscribe(
               data => {
                this.resData = data;

                this.ts =this.resData.result;
                //console.log("new timestamp is:"+this.ts);

             
               //console.log("result is:");
           
                 // this.is_edit=true;

                  //console.log(this.resData);
                  this.snackBar.open('נוצר בהצלחה!', null, {
                    duration: 1700,
                    verticalPosition: 'top' });
                       
                  this.getpdf()

 
  },
  error => { 
    //console.error("Error");
    
  }
);
  // this. getLink();
  }
  else

  {
    this.snackBar.open('שגיאה!', null, {
      duration: 1700,
      verticalPosition: 'top' });
  }
  this.x=0;
}
////////////////////////Edit Pdf//////////////////////

  toggle(lst) {
  this.newMail = false;
     
  this.pdf_id=lst.pdf_id;
  //console.log( "here$$$$$$$$$$$$$$$$$$$$$$"+this.pdf_id)
 
  this.pdfdata=lst;

  //console.log(this.pdfdata)

    this.message=this.pdfdata.file_desc;

  if(!this.show_dialog)
  this.show_dialog = !this.show_dialog;
        
    }

  //   setEditPdf()
  //   {
  //     //console.log("Calling Function...33333333333333.....")
    
    
  //     this.upload_type = "pdfUzan"
    
  //   var url = "http://185.106.129.16:1337/fitnessApp/uploadEdittedPdf";
  //            var data = {"upload_type":this.upload_type,"app_id":"24", "manager_id":"1141", "pdf":this.newtimestamp, "timestamp":this.newtimestamp,"pdf_id":this.pdf_id};
  //            //console.log("***********************")
           
  //            //console.log("query is:")
  //            //console.log(data)
  //            //console.log("***********************")
           
  //            // var arr = {"apikey" : "KhOSpc4cf67AkbRpq1hkq5O3LPlwU9IAtILaL27EPMlYr27zipbNCsQaeXkSeK3R", "data":data, "requestType":"userLogin"};
  //            // var arr1 = {"requestData" : arr};
  //          this.ajaxService.post(data, url).subscribe(
  //         data => {
  //          this.resData = data;
  //          this.getpdf();
    
  //   // this.getLink()
  //   //console.log("result is:"+this.resData);
    
    
  //   // this.is_edit=true;
    
  //   //console.log(this.resData);
    
    
  //   },
  //   error => { 
  //   //console.error("Error");
    
  //   }
  //   );
    
  // }

editPdf()
{
  this.setPdfData()

     
  var getdata = {};
 
  this.pdf_id=this.pdf_id;

//console.log("pdf id in edit pdf function:")
//console.log(this.pdf_id)

this.message=this.message;

//console.log("updated msg:"+this.message)


this.ts=parseInt(this.newtimestamp);
this.timestmp = [{timestampId:this.ts}]



var url = "http://185.106.129.16:1337/fitnessApp/editPDF";
var data = {"app_id":"24", "manager_id":"1141", "pdf_id":this.pdf_id,"group_id":"0","file_desc":this.message,"timestamp":JSON.stringify(this.timestmp)};
//console.log(data)

this.ajaxService.post(data, url).subscribe(
  data => {
    this.resData = data;
    
    //console.log("result is:");


    //console.log(this.resData);
    //console.log(this.resData);
    this.snackBar.open('עודכן בהצלחה!', null, {
      duration: 1700,
      verticalPosition: 'top' });
 
  },
  error => { 
    //console.error("Error");
    
  }
);

}
///////////////////////////////Delete Pdf///////////////////////////////////////

openDeleteDialog(id): void {
  let dialogRef = this.dialog.open(DeleteDialog , {
    data: { name:"" }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.delresult=result;
    if(this.delresult=="1")
    this.deletepdf(id);
  });
}


deletepdf(pdf_id)
{
//console.log("pdf id: "+pdf_id)

var getdata = {};
var url = "http://185.106.129.16:1337/fitnessApp/deletePDF";
var data = {"manager_id":"1141","app_id":"24","pdf_id":pdf_id};
  this.ajaxService.post(data, url).subscribe(
  data => {
    this.resData = data;
    this.getpdf();
    //console.log("result is:");


    //console.log(this.resData);
    this.snackBar.open('נמחק בהצלחה!', null, {
      duration: 2000,
      verticalPosition: 'top'
    });
  },
  error => { 
    //console.error("Error");
    
  }
);
  // this. getLink();
}

////////////////////////////View pdf/////////////////////////////////

ViewPdf()
{
    
     
  var getdata = {};
 
  this.pdf_id=this.pdf_id;

//console.log("pdf id in edit pdf function:")
//console.log(this.pdf_id)

this.message=this.message;

//console.log("updated msg:"+this.message)

var d = new Date();
     var timestamp = d.getTime();

     var flag = "1";
     this.tt=timestamp+flag;

var url = "http://185.106.129.16:1337/fitnessApp/editPDF";
var data = {"app_id":"24", "manager_id":"1141", "pdf_id":this.pdf_id,"group_id":"0","file_desc":this.message,"timestamp":this.tt};
//console.log(data)

this.ajaxService.post(data, url).subscribe(
  data => {
    this.resData = data;
    
    //console.log("result is:");

    //console.log(this.resData);

 
  },
  error => { 
    //console.error("Error");
    
  }
);

}












_gid(_gid: any): any {
    throw new Error("Method not implemented.");
  }
}

///////////////////////pdf////////////////////////////////////////