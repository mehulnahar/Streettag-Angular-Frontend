import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
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
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs/observable";
import { environment } from "src/environments/environment";
import { Subscription } from "rxjs/internal/Subscription";
import { pluck } from "rxjs/operators/pluck";
import { ImageViewerComponent } from "src/app/shared/image-viewer/image-viewer.component";
import { ImageViewergModel } from "src/app/shared/image-viewer/image-viewer.model";

@Component({
  selector: "app-monument-tour",
  templateUrl: "./monument-tour.component.html",
  styleUrls: ["./monument-tour.component.scss"],
})
export class MonumentTourComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "tourName",
    "description",
    "lat",
    "lng",
    "image",
    "startDate",
    "view",
    "edit",
  ];
  public dataSource: any;
  getTour$: Subscription;
  constructor(
    private ajaxService: AjaxService,
    private dialog: MatDialog,
    private appSettings: AppSettings
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getTour();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTour() {
    const url = `${this.baseUrl}getTourList`;
    this.getTour$ = this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(AddTourDialog, {});

    dialogRef.afterClosed().subscribe((result) => {
      this.getTour();
    });
  }

  openEditDialog(data): void {
    let dialogRef = this.dialog.open(EditTourDialog, {
      data: { data },
      minWidth : "60%"
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTour();
    });
  }

  openDetailDialog(data): void {
    let dialogRef = this.dialog.open(DetailDialog, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnDestroy() {
    this.getTour$.unsubscribe();
  }
}

@Component({
  selector: "add-tour",
  templateUrl: "./addTour-dialog.html",
  styleUrls: ["./monument-tour.component.scss"],
})
export class AddTourDialog implements OnDestroy {
  @ViewChild('takeInput', {static: false}) InputVar: ElementRef;
  clicked = false;
  resData: any;
  angForm: FormGroup;
  public dataSource1: any;
  public Monumentdata: any;
  public disabledLocation: any;
  filteredOptions: Observable<any>;
  myControl = new FormControl();
  private readonly baseUrl = environment.baseUrl;
  address;
  default_lat: number = 51.5339834;
  default_lng: number = 0.0753218;
  lat: number;
  lng: number;
  setLocation$: Subscription;
  add$: Subscription;
  getMonuments$: Subscription;
  nearByLatLng$: Observable<any>;
  zoom: number = 10;
  constructor(
    public dialogRef: MatDialogRef<AddTourDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getallMonuments();
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      tourName: ["", [Validators.required]],
      location: this.fb.array([this.fb.control("", Validators.required)]),
      description: ["",[Validators.required]],
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
      tour_image: ["", [Validators.required]],
    });
  }

  get location() {
    return this.angForm.get("location") as FormArray;
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;

    this.angForm.get("lat").setValue($event.coords.lat);
    this.angForm.get("lng").setValue($event.coords.lng);
  }

  setlocation() {
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      this.address +
      "&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8";
    this.setLocation$ = this.ajaxService
      .getLocation(url)
      .subscribe((data: any) => {
        if (
          typeof data != "undefined" &&
          data != "" &&
          typeof data.results != "undefined" &&
          data.results != ""
        ) {
          var lattitude = data.results[0].geometry.location.lat;
          var longitude = data.results[0].geometry.location.lng;
          this.lat = parseFloat(lattitude);
          this.default_lat = parseFloat(lattitude);
          this.lng = parseFloat(longitude);
          this.default_lng = parseFloat(longitude);
          this.angForm.get("lat").setValue(lattitude);
          this.angForm.get("lng").setValue(longitude);
          this.zoom = 18;
        }
      });
  }

  addMoreLocation() {
    this.location.push(this.fb.control("", Validators.required));
    this.Monumentdata.map((item) => {
      if (item.id == this.disabledLocation) item.disable = true;
    });
    this.disabledLocation = null;
  }

  RemoveLocation() {
    let id = this.location.at(this.location.length - 1).value;
    if (this.location.length != 1) {
      this.location.removeAt(this.location.length - 1);
      this.Monumentdata.map((item) => {
        if (item.id == id) item.disable = false;
      });
      this.disabledLocation = null;
    }
  }

  async getallMonuments() {
    const url = `${this.baseUrl}getMonuments`;
    this.getMonuments$ = await this.ajaxService
      .get(url)
      .subscribe(async (data) => {
        this.Monumentdata = await data["response"];
      });
  }

  remove_monument(data) {
    //Storing id in temp variable and when add more location then disable it on this addMoreLocation()
    this.disabledLocation = data;
  }

  handleInputChange(e) {
      if(e.target.files[0].type == 'image/jpg' || e.target.files[0].type == 'image/jpeg' || e.target.files[0].type == 'image/png'){
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      }else{
        this.snackBar.open('Only Images are allowed ( JPG | PNG | JPEG )', null, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.InputVar.nativeElement.value = ""; 
      }
    }
  
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.angForm.get("tour_image").setValue(reader.result);
  }

  addevent() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      let reqObj = {
        tourName : this.angForm.get('tourName').value.replaceAll("'","`").replaceAll('"','``'),
        location : this.angForm.get('location').value,
        description : this.angForm.get('description').value.replaceAll("'","`").replaceAll('"','``'),
        lat : this.angForm.get('lat').value,
        lng : this.angForm.get('lng').value,
        tour_image : this.angForm.get('tour_image').value,
      }
      const url = `${this.baseUrl}addMonumentTour`;
      this.add$ = this.ajaxService.post(reqObj , url).subscribe(
        (data) => {
          this.resData = data;
          this.snackBar.open(this.resData.msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open(error.error.msg || "Something went wrong , please try again.", null, {
            duration: 4000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.dialogRef.close();
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

  ngOnDestroy() {
    if(this.add$)this.add$.unsubscribe();
    if(this.setLocation$)this.setLocation$.unsubscribe();
    this.getMonuments$.unsubscribe();
  }
}

@Component({
  selector: "edit-tour",
  templateUrl: "./editTour-dialog.html",
  styleUrls: ["./monument-tour.component.scss"],
})
export class EditTourDialog implements OnDestroy {
  @ViewChild('takeInput', {static: false}) InputVar: ElementRef;
  clicked = false;
  resData: any;
  angForm: FormGroup;
  public dataSource1: any;
  public Monumentdata: any;
  public tourdata: any;
  public disabledLocation: any;
  public spinner: Boolean = true;
  private readonly baseUrl = environment.baseUrl;
  getMonuments$: Subscription;
  tour$: Subscription;
  edit$: Subscription;
  constructor(
    public dialogRef: MatDialogRef<EditTourDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private dialog : MatDialog
  ) {
    this.getallMonuments();
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      tourName: [this.data.data.tour_name, [Validators.required]],
      location: this.fb.array([]),
      tour_id: this.data.data.id,
      description: [this.data.data.discription ,[Validators.required]],
      tour_image: [this.data.data.tour_image, [Validators.required]],
      imageChanged: false,
    });
  }

  get location() {
    return this.angForm.get("location") as FormArray;
  }

  addMoreLocation() {
    this.location.push(this.fb.control("", Validators.required));
    this.Monumentdata.map((item) => {
      if (item.id == this.disabledLocation) item.disable = true;
    });
    this.disabledLocation = null;
  }

  RemoveLocation() {
    let id = this.location.at(this.location.length - 1).value;
    if (this.location.length != 1) {
      this.location.removeAt(this.location.length - 1);
      this.Monumentdata.map((item) => {
        if (item.id == id) item.disable = false;
      });
      this.disabledLocation = null;
    }
  }

  async getallMonuments() {
    const url = `${this.baseUrl}getMonuments`;
    this.getMonuments$ = this.ajaxService
      .get(url)
      .subscribe(async (data) => {
        this.Monumentdata = await data["response"];
        await this.tourDetail();
      });
  }

  remove_monument(data) {
    //Storing id in temp variable and when add more location then disable it on this addMoreLocation()
    this.disabledLocation = data;
  }

  tourDetail() {
    const url = `${this.baseUrl}tourDetail`;
    let data = { id: this.data.data.id };
    this.tour$ = this.ajaxService.post(data, url).subscribe((data) => {
      this.tourdata = data["response"];
      
      //push controler into FormArray for displaying selected monument data
      this.tourdata.forEach((value: any, key: any) => {
        this.location.push(
          this.fb.control(value.monument_id, Validators.required)
        );
      
        for (let i = 0; i < this.Monumentdata.length; i++) {
          if (this.Monumentdata[i].id == value.monument_id) {
            this.Monumentdata[i].disable = true;
            break;
          }
        }
      });
      this.spinner = false;
    });
  }

  handleInputChange(e) {
    if(e.target.files[0].type == 'image/jpg' || e.target.files[0].type == 'image/jpeg' || e.target.files[0].type == 'image/png'){
      this.angForm.get("imageChanged").setValue(true);
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }else{
      this.snackBar.open('Only Images are allowed ( JPG | PNG | JPEG )', null, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      this.InputVar.nativeElement.value = ""; 
    }
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.angForm.get("tour_image").setValue(reader.result);
  }

  editevent() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}editMonumentTour`;
      
    
      let reqObj = {
        tourName : this.angForm.get('tourName').value.replaceAll("'","`").replaceAll('"','``'),
        location : this.angForm.get('location').value,
        description : this.angForm.get('description').value.replaceAll("'","`").replaceAll('"','``'),
        tour_id : this.angForm.get('tour_id').value,
        imageChanged : this.angForm.get('imageChanged').value,
        tour_image : this.angForm.get('tour_image').value,
      }
      this.edit$ = this.ajaxService.post(reqObj, url).subscribe(
        (data) => {
          this.resData = data;
          this.snackBar.open(this.resData.msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });

          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open(error.error.msg || "Something went wrong , please try again.", null, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
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

  OpenImageViewerBox(imageUrl:any){
    const message = `Image viewer`;
    const dialogData = new ImageViewergModel("Image Viewer", '' ,imageUrl);
    const dialogRef = this.dialog.open(ImageViewerComponent,  {
      minWidth : "50%",
      minHeight: 'calc(100vh - 90px)',
      height : 'auto',
      data: dialogData,
      disableClose:true,
    });
}

  ngOnDestroy() {
    if(this.edit$)this.edit$.unsubscribe();
    if(this.tour$)this.tour$.unsubscribe();
    this.getMonuments$.unsubscribe();
  }
}

@Component({
  selector: "detail-tour",
  templateUrl: "./detailDialog.html",
  styleUrls: ["./monument-tour.component.scss"],
})
export class DetailDialog implements OnDestroy {
  public tourData: any;
  public spinner: Boolean = true;
  private readonly baseUrl = environment.baseUrl;
  showDetails$: Subscription;
  constructor(
    public dialogRef: MatDialogRef<DetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService
  ) {
    this.showDetail();
  }
  showDetail() {
    const url = `${this.baseUrl}tourDetail`;
    let data = { id: this.data.id };
    this.showDetails$ = this.ajaxService.post(data, url).subscribe((data) => {
      this.tourData = data["response"];
      this.spinner = false;
    });
  }

  ngOnDestroy() {
    this.showDetails$.unsubscribe();
  }
}
