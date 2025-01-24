import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../../app.settings";
import { Settings } from "../../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subscription } from "rxjs/internal/Subscription";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";
import { pluck } from "rxjs/operators/pluck";
import { Observable } from "rxjs/observable";
import { trim } from "jquery/dist/jquery.min";
import { ImageViewergModel } from "src/app/shared/image-viewer/image-viewer.model";
import { ImageViewerComponent } from "src/app/shared/image-viewer/image-viewer.component";
import { data } from "jquery";

@Component({
  selector: "app-monument",
  templateUrl: "./monument.component.html",
  styleUrls: ["./monument.component.scss"],
})
export class MonumentComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  public Monument$: Subscription;

  resData: any;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns = [
    "serial_number",
    "name",
    "description",
    "lat",
    "lng",
    "link",
    "basketFlag",
    "edit",
    "delete",
  ];
  public dataSource: any;
  delete$: Subscription;
  constructor(
    private ajaxService: AjaxService,
    private dialog: MatDialog,
    private appSettings: AppSettings,
    public snackBar: MatSnackBar
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getallMonuments();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getallMonuments() {
    const url = `${this.baseUrl}getMonuments`;
    this.Monument$ = this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(AddMonumentDialog, {
    minWidth : "75%",
    minHeight: 'calc(100vh - 90px)',
    height : 'auto',
    disableClose:true,});

    dialogRef.afterClosed().subscribe((result) => {
      this.getallMonuments();
    });
  }

  openEditDialog(data): void {
    let dialogRef1 = this.dialog.open(EditMonumentDialog, {
      data: { data },
      minWidth : "75%",
      minHeight: 'calc(100vh - 90px)',
      height : 'auto',
      disableClose:true,
    });
    dialogRef1.afterClosed().subscribe((result) => {
      this.getallMonuments();
    });
  }

 
  confirmDialog(data: any): void {
    const message = `Are you sure you want to Delete ${data.name} Monument?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if(dialogResult == true){
        const url = `${this.baseUrl}deleteMonument`;
        this.delete$ = this.ajaxService.post({ id : data.id }, url).subscribe(
          (done) => {
            this.snackBar.open("Monument has been Deleted Successfully.", null, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: ["blue-snackbar"],
            });
              //Delete data from dataSource
              this.dataSource.data = this.dataSource.data.filter((value,key)=>{
                return value.id != data.id
              })
          },
          (error) => {
            this.snackBar.open(error.error.msg || "Something went wrong", null, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          });
      }
    });
  }

  ngOnDestroy() {
    this.Monument$.unsubscribe();
    if (this.delete$) this.delete$.unsubscribe();
  }
}

@Component({
  selector: "add-monument",
  templateUrl: "./addmessage-dialog.html",
  styleUrls: ["./monument.component.scss"],
})
export class AddMonumentDialog implements OnInit, OnDestroy {
  @ViewChild("fileInput", { static: true }) fileInput: ElementRef;

  clicked = false;
  resData: any;
  angForm: FormGroup;
  default_lat: number = 51.5339834;
  default_lng: number = 0.0753218;
  public lat: number;
  public lng: number;
  SetLocation$: Subscription;
  add$: Subscription;
  public location: any;
  public multipleImages: any;
  public multipleVideos: any;
  public multipleAudio: any;
  public dataSource1: any;
  public progrees: Number;
  public SelectedVideoCount: Number = 0;
  public SelectedAudioCount: Number = 0;
  public SelectedImgCount: Number = 0;
  public showBar: Boolean = false;
  zoom:number = 10;
  private readonly baseUrl = environment.baseUrl;
  private readonly userUrl = environment.userUrl;
  private geoCoder;
  nearByLatLng: Observable<any>;
  resData1: any;
  delete$: Subscription;
  constructor(
    public dialogRef: MatDialogRef<AddMonumentDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private _http: HttpClient,
    private dialog: MatDialog,
    
  ) {
    this.createForm();
  }

ngOnInit(){
  this.angForm.get('basketFlag').valueChanges
  .subscribe(checkedVlaue =>{
    const link = this.angForm.get('link');
    const reg =
    "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
    if(checkedVlaue == 0){
      console.warn(link)
      link.clearValidators();
    }else{
      link.setValidators([Validators.required,Validators.pattern(reg)]);
    }
    link.updateValueAndValidity();
  });
}

  createForm() {
     this.angForm = this.fb.group({
      name: ["", [Validators.required]],
      description: this.fb.array([this.fb.control("")]),
      link: [""],
      basketFlag :["0", [Validators.required]],
      address:['']
    });
  }

  

  get description() {
    return this.angForm.get("description") as FormArray;
  }

  get getAddress () {
    return this.angForm.get('address').value
  }

  set address (val : String) {
    this.angForm.get('address').setValue(val);
  }

  addMoreDecription() {
    this.description.push(this.fb.control(""));
  }

  RemoveDecription() {
    if (this.description.length > 1) {
      this.description.removeAt(this.description.length - 1);
    }
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.default_lat = $event.coords.lat;
    this.default_lng = $event.coords.lng;
    this.zoom = 17;
    this.findAddressByCoordinates(this.lat, this.lng)
    this.getNearByTags();
    }

  findAddressByCoordinates(latitude: number,longitude: number) {
    this.geoCoder = new google.maps.Geocoder;
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  setlocation() {
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      this.location +
      "&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8";
    this.SetLocation$ = this.ajaxService
      .getLocation(url)
      .subscribe((data: any) => {
        if (
          typeof data != "undefined" &&
          data != "" &&
          typeof data.results != "undefined" &&
          data.results != ""
        ) {
          this.address = data.results[0].formatted_address;
          var lattitude = data.results[0].geometry.location.lat;
          var longitude = data.results[0].geometry.location.lng;
          this.lat = lattitude;
          this.default_lat = lattitude;
          this.lng = longitude;
          this.default_lng = longitude;
          this.zoom = 18;
          this.getNearByTags();
        }
      });
  }


  
  confirmDialog(id: number): void {
    const message = `Are you sure you want to Delete this Tag?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if(dialogResult == true){
        const url = `${this.userUrl}strtg/deleteAutoTags`;
        var data1 = {
          qid: id
        };
        this.delete$ = this.ajaxService.post(data1, url).subscribe((data) => {
          this.resData1 = data;
          let dynamicSnackColor = "blue-snackbar";
          if(this.resData1.status == "false") {
            dynamicSnackColor = "red-snackbar";
            this.snackBar.open(this.resData1.msg, null, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: dynamicSnackColor,
            });
          } else {
            this.getNearByTags();
          }
        });        
      }
    });
  }

  
 
  getNearByTags() {
     var url = `${this.baseUrl}getNearByTags`;
    var data1 = {
      diameter: "1000",
      lat: this.lat,
      lng: this.lng,
    };
    this.nearByLatLng = this.ajaxService.post(data1, url).pipe(pluck("response"))
  }

  addevent() {
    if (this.lat == null || this.lng == null) {
      this.snackBar.open("Please mark the Location.", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    } else if (this.SelectedAudioCount == 0 ||
      this.SelectedImgCount == 0 ||
      this.SelectedVideoCount == 0
    ) {
      this.snackBar.open(
        "Please upload atleast one Image ,Video and Audio.",
        null,
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        }
      );
    } else if (this.angForm.status == "VALID") {
      this.clicked = true;
      const fd: any = new FormData();
      fd.append("name", this.angForm.get("name").value.replaceAll("'","`").replaceAll('"','``'));
      fd.append(
        "description",
        JSON.stringify(this.angForm.get("description").value)
      );
      fd.append("lat", this.lat);
      fd.append("lng", this.lng);
      fd.append("address", this.getAddress.replaceAll("'","`"));
      fd.append("link",trim(this.angForm.get("link").value));
      fd.append("basketFlag",this.angForm.get("basketFlag").value);
      if (this.multipleImages != null) {
        for (let img of this.multipleImages) {
          fd.append("img", img);
        }
      }

      if (this.multipleAudio != null) {
        for (let audio of this.multipleAudio) {
          fd.append("audio", audio);
        }
      }

      if (this.multipleVideos != null) {
        for (let vid of this.multipleVideos) {
          fd.append("videos", vid);
        }
      }
      this.add$ = this._http
        .post(`${this.baseUrl}addMonument`, fd, {
          reportProgress: true,
          observe: "events",
        })
        .subscribe(
          (data) => {
            if (data.type === HttpEventType.UploadProgress) {
              this.showBar = true;
              this.progrees = Math.round((data.loaded / data.total) * 100);
            } else if (data.type === HttpEventType.Response) {
              this.resData = data;
              this.snackBar.open("Monument Added Successfully.", null, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: ["blue-snackbar"],
              });
              this.dialogRef.close();
            }
          },
          (error) => {
            this.snackBar.open(error.error.msg || 'Something went wrong , please try again'
            , null, {
              duration: 3500,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
              this.showBar = false;
          //  this.dialogRef.close();
          }
        );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, null, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }

  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[0].type == 'video/mp4'){
        continue;
        }else{
          this.SelectedVideoCount = 0;
        this.snackBar.open('Only Videos are allowed ( MP4 )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        return;
       }
    }
    
    if (event.target.files.length > 0) {
        this.SelectedVideoCount = event.target.files.length;
        this.multipleVideos = event.target.files;
     }
  }

  onFileChange1(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[0].type == 'audio/mpeg'){
        continue;
        }else{
          this.snackBar.open('Only Audios are allowed ( MP3 )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.SelectedAudioCount = 0;
        return;
      }
    }
   
    if (event.target.files.length > 0) {
      this.SelectedAudioCount = event.target.files.length;
      this.multipleAudio = event.target.files;
    }
  }
  onFileChangeImage(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[i].type == 'image/jpg' || event.target.files[i].type == 'image/jpeg' || event.target.files[i].type == 'image/png'){
        continue;
        }else{
        this.snackBar.open('Only Images are allowed ( JPG | PNG | JPEG )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.SelectedImgCount = 0;
        break;
      }
    }
    if (event.target.files.length > 0) {
      this.SelectedImgCount = event.target.files.length;
      this.multipleImages = event.target.files;
    }
  }

  ngOnDestroy() {
    if (this.add$) this.add$.unsubscribe();
    if (this.SetLocation$) this.SetLocation$.unsubscribe();
    if (this.delete$) this.delete$.unsubscribe();
  }
}

@Component({
  selector: "edit-monument",
  templateUrl: "./editmessage-dialog.html",
  styleUrls: ["./monument.component.scss"],
})
export class EditMonumentDialog implements OnInit,  OnDestroy {
  @ViewChild("fileInput", { static: true }) fileInput: ElementRef;
  clicked = false;
  resData: any;
  angForm: FormGroup;
  public videoUrl: Array<String>;
  public audioUrl: Array<String>;
  public imageUrl: Array<String>;
  private readonly baseUrl = environment.baseUrl;
  public multipleImages: any;
  public multipleVideos: any;
  public multipleAudio: any;
  public progrees: Number;
  public showBar: Boolean = false;
  public SelectedVideoCount: Number = 0;
  public SelectedAudioCount: Number = 0;
  public SelectedImgCount: Number = 0;
  edit$: Subscription;
  constructor(
    public dialogRef: MatDialogRef<EditMonumentDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private _http: HttpClient,
    private dialog: MatDialog,

  ) {
    this.createForm();
    this.videoUrl = JSON.parse(this.data.data.video);
    this.audioUrl = JSON.parse(this.data.data.audio);
    this.imageUrl = JSON.parse(this.data.data.image);
  }

  ngOnInit(){
    this.angForm.get('basketFlag').valueChanges
    .subscribe(checkedVlaue =>{
      const link = this.angForm.get('link');
      const reg =
      "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
      if(checkedVlaue == 0){
        console.warn(link)
        link.clearValidators();
      }else{
        link.setValidators([Validators.required,Validators.pattern(reg)]);
      }
      link.updateValueAndValidity();
    });
  }

  createForm() {
   this.angForm = this.fb.group({
      name: [this.data.data.name, [Validators.required]],
      description: this.fb.array(JSON.parse(this.data.data.description)),
      link: [this.data.data.link],
      basketFlag : [String(this.data.data.add_basket)]
    });
  }

  get description() {
    return this.angForm.get("description") as FormArray;
  }

  addMoreDecription() {
    this.description.push(this.fb.control(""));
  }

  RemoveDecription() {
    if (this.description.length > 1) {
      this.description.removeAt(this.description.length - 1);
    }
  }

  editevent() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}editMonument`;
      this.angForm.value.id = this.data.data.id;
      const fd: any = new FormData();
      fd.append("name", this.angForm.get("name").value.replaceAll("'","`").replaceAll('"','``'));
      fd.append(
        "description",
        JSON.stringify(this.angForm.get("description").value)
      );
      fd.append("id", this.data.data.id);
      fd.append("link",trim(this.angForm.get("link").value));
      fd.append("basketFlag",this.angForm.get("basketFlag").value);
      if (this.multipleImages != null) {
        for (let img of this.multipleImages) {
          fd.append("img", img);
        }
      }

      if (this.multipleAudio != null) {
        for (let audio of this.multipleAudio) {
          fd.append("audio", audio);
        }
      }

      if (this.multipleVideos != null) {
        for (let vid of this.multipleVideos) {
          fd.append("videos", vid);
        }
      }
      this.edit$ = this._http
        .post(url, fd, {
          reportProgress: true,
          observe: "events",
        })
        .subscribe(
          (data) => {
            if (data.type === HttpEventType.UploadProgress) {
              this.showBar = true;
              this.progrees = Math.round((data.loaded / data.total) * 100);
            } else if (data.type === HttpEventType.Response) {
              this.resData = data;
              this.snackBar.open("Monument Updated Successfully", null, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: ["blue-snackbar"],
              });
              this.dialogRef.close();
            }
          },
          (error) => {
            this.snackBar.open(error.error.msg || 'Something went wrong , please try again', null, {
              duration: 2500,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
            this.dialogRef.close();
          }
        );
    }
  }

  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[0].type == 'video/mp4'){
        continue;
        }else{
        this.SelectedVideoCount = 0;
        this.snackBar.open('Only Videos are allowed ( MP4 )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        return;
       }
    }
    
    if (event.target.files.length > 0) {
        this.SelectedVideoCount = event.target.files.length;
        this.multipleVideos = event.target.files;
     }
  }

  onFileChange1(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[0].type == 'audio/mpeg'){
        continue;
        }else{
        this.snackBar.open('Only Audios are allowed ( MP3 )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.SelectedAudioCount = 0;
        return;
      }
    }
   
    if (event.target.files.length > 0) {
      this.SelectedAudioCount = event.target.files.length;
      this.multipleAudio = event.target.files;
    }
  }

  onFileChangeImage(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[i].type == 'image/jpg' || event.target.files[i].type == 'image/jpeg' || event.target.files[i].type == 'image/png'){
        continue;
        }else{
        this.snackBar.open('Only Images are allowed ( JPG | PNG | JPEG )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.SelectedImgCount = 0;
        break;
      }
    }
    if (event.target.files.length > 0) {
      this.SelectedImgCount = event.target.files.length;
      this.multipleImages = event.target.files;
    }
  }


  OpenImageViewerBox(image:string){
    const message = `Image viewer`;
    const dialogData = new ImageViewergModel("Image Viewer", '' ,image);
    const dialogRef = this.dialog.open(ImageViewerComponent,  {
      minWidth : "50%",
      minHeight: 'calc(100vh - 90px)',
      height : 'auto',
      data: dialogData,
      disableClose:true
    });
}


  ngOnDestroy(): void {
    if (this.edit$) this.edit$.unsubscribe();
  }
}
