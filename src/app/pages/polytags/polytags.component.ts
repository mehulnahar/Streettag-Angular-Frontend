import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatFormFieldModule, MatFormFieldControl } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";
import { pluck } from "rxjs/operators/pluck";
import { Observable } from "rxjs/observable";

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./polytags.component.html",
  styleUrls: ["./polytags.component.scss"],
  // encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class PolytagsComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  public newMail: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;

  public show_dialog: boolean = false;
  public button_name: any = "Show Login Form!";
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 10;
  public displayedColumns = [
    "serial_number",
    "polytag_name",
    "score",
    "category",
    "asset_name",
    "edit",
    "delete",
  ]; // 'start_date', 'end_date',
  public dataSource: any;
  public dataSourceLocation: any;
  public selectedValue: string;
  public spinner = true;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.spinner;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getPolyTags();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  ////////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    //event.location = this.dataSourceLocation;
    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogEditPolytags, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog();
      //  this.getMsggroups();

      //  this.getallevent();
      //  this.viewDetail(result);
      //  this.toggle();
      this.getPolyTags();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogPolytags, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog()

      this.getPolyTags();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  ///////////////get all event//////////////////
  getPolyTags() {
      const url = `${this.baseUrl}getPolyTags`;
     this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this Poly Tag?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deletePolytag(id);
      }
    });
  }

  deletePolytag(id) {
    var getdata = {};
    var url = `${this.baseUrl}deletePolytag`;
    var data = { polytag_id: id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getPolyTags();

        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],

        });
      },
      (error) => {
        //console.error("Error");
      }
    );
    // this. getLink();
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogPolytags {
  public lat: number = 51.5339834;
  public lng: number = 0.0753218;
  public zoom: number = 16;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  resData1: any;
  allLocations = [] as any;
  location_name = "";
  circuit_name = "";
  no_of_QR = "";
  start_date = "";
  end_date = "";
  location = "";
  asset_name = "";

  score = 20;
  max_scan = 1;
  select_scan_id: any;
  scan_type = 2;
  is_building_qr = false;
  check_is_building_qr = false;
  check_building_validation = 0;
  public dataSourceLocation: any;
  public dataSource: any;

  public dataSourceCategory:Observable<any>;
  public dataSourceCategoryAssets: Observable<any>;

  public dataSourceFloors: any;

  public nearByLatLng: any = [
    { lat: 22.75444509877525, lng: 75.86388239769276, distanceeee: 0 },
    {
      lat: 22.754036909582947,
      lng: 75.86448178548305,
      distanceeee: 76.40463320913996,
    },
  ];
 
  title = "";
  asset_id = "";
  category_id = "";

  building_name = "";
  floor_name = "";
  building_id: any;
  is_building_qr_value: any;
  val: any;
  private readonly baseUrl = environment.baseUrl;
  private readonly userUrl = environment.userUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogPolytags>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });

    this.getAssetsCategory();
    this.getNearByTags();
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getAssetsCategory() {
       var url = `${this.baseUrl}getAssetsCategory`;

    this.dataSourceCategory = this.ajaxService.get(url).pipe(pluck("response"))
  }

  getPolyTags() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getPolyTags`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log("all Locations:");
      //console.log(this.dataSource)
    });
  }

  markerDragEnd($event: any) {
    //console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getNearByTags();
  }

  updateTagLatLng($event: any, $street: any) {
    // console.log('this is event', $event);
    // console.log('street_name', $street);

    // this.lat = $event.coords.lat;
    // this.lng = $event.coords.lng;
    this.getNearByTags();
  }

  clicked($qid: any) {
    //console.log('Removing tags');
    this.removeTag($qid);
  }

  changeEvent($event: any) {
    //alert('changeEvent !');
    this.setlocation();
  }

  mouseOvered() {
    alert("laaaaaaaa....");
  }

  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
  }

  onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
  }

  setlocation() {
    //this.location=this.location;
    //console.log("getting location" + this.location)

    ////console.log("calling get lat lng function")

    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      this.location +
      "&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8";

    ////console.log("usseerrrsssss")

    return this.ajaxService.getLocation(url).subscribe((data: any) => {
      if (
        typeof data != "undefined" &&
        data != "" &&
        typeof data.results != "undefined" &&
        data.results != ""
      ) {
        ////console.log(data);
        var lattitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;

        this.lat = lattitude;
        this.lng = longitude;

        //console.log("getting lat of" + this.lat)
        //console.log("getting long of" + this.lng)
        this.getNearByTags();
        return data;
      }
    });
  }

  checkBuildingQrValue(res) {
    if (res.source.value) {
      this.check_is_building_qr = false;
      this.check_building_validation = 0;
      //console.log(this.check_building_validation)
    } else {
      this.check_is_building_qr = true;
      this.check_building_validation = 1;
      //console.log(this.check_building_validation)
    }
  }

  createForm() {
    this.angForm = this.fb.group({
      //category_id: ['', [Validators.required]],
      title: ["", [Validators.required]],
      score: ["", [Validators.required, Validators.pattern("[0-9]*")]],
      // start_date: ['', [Validators.required]],
      // end_date: ['', [Validators.required]],
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
    });

    //, Validators.pattern('[0-9]*')
  }

  checkScanType(res) {
    if (res == 1) {
      this.select_scan_id = true;
    } else {
      this.select_scan_id = false;
    }
  }

  get_buiding_id(res) {
    this.getFloors(res);
  }

  get_category_id(res) {
    this.getAssetsByCategoryId(res);
  }

  getAssetsByCategoryId(res) {
    //console.log(res);
    var url = `${this.baseUrl}getAssetByCategoryId`;
    var data1 = {
      category_id: res,
    };

    //console.log(data1);
    this.dataSourceCategoryAssets = this.ajaxService.post(data1, url).pipe(pluck("response"));
  }

  getFloors(res) {
    //console.log(res);
    var url = `${this.baseUrl}getFloorByBuildingId`;
    var data1 = {
      building_id: res,
    };

    //console.log(data1);
    this.ajaxService.post(data1, url).subscribe((data) => {
      this.dataSourceFloors = data["response"];
      //console.log(this.dataSourceFloors);
    });
  }

  getNearByTags() {
    var url = `${this.baseUrl}getNearByTags`;
    var data1 = {
      diameter: "1000",
      lat: this.lat,
      lng: this.lng,
    };

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.nearByLatLng = data["response"];
    });
  }

  removeTag($id: any) {
    var url = `${this.userUrl}strtg/deleteAutoTags`;
    var data1 = {
      qid: $id,
    };

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.resData1 = data;
    
      let dynamicSnackColor = "blue-snackbar";

      //console.log('---------- data ------------', this.resData1);

      if (this.resData1.status == "false") {
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

  Mynumber(val) {
    return parseFloat(val);
  }

  onchangeM() {
    alert("khushal");
  }

  addevent() {
    // console.log('adding events');
    // console.log(this.angForm.status);

    // Category & Asset Check
    if (
      (this.category_id == "" || this.category_id != "") &&
      this.asset_id == ""
    ) {
      this.snackBar.open("Select Category! and Asset!", null, {
        duration: 3000,
        verticalPosition: "top",
      });
      return false;
    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}addPolyTag`;
      var data1 = {
        title: this.title,
        score: this.score,
        lat: this.lat,
        lng: this.lng,
        category_id: this.category_id,
        asset_id: this.asset_id,
      };

      //console.log(data1);

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getPolyTags();
        let dynamicSnackColor = "blue-snackbar";

        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";

          this.snackBar.open(this.resData.msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: dynamicSnackColor,
          });
        } else {
          this.snackBar.open(this.resData.msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: dynamicSnackColor,
          });
          this.dialogRef.close();
        }
      });
    }
  }
}

@Component({
  selector: "dialog-editPolytag",
  templateUrl: "dialog-editPolytag.html",
})
export class DialogEditPolytags {
  allLocations = [] as any;
  form: FormGroup;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_name = "";
  polytag_name = "";
  score = "";
  polytag_id = "";
  location_id = "";
  no_of_QR = "";
  start_date = "";
  end_date = "";
  resData: any;
  public dataSourceLocation: any;

  selectedValue: string;

  public zoom: number = 7;
  public settings: Settings;

  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogEditPolytags>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.polytag_name = this.data.event.polytag_name;
    this.polytag_id = this.data.event.id;
    this.score = this.data.event.score;

    //console.log(this.data.event);

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.angForm = this.fb.group({
      polytag_name: ["", [Validators.required]],
      score: ["", [Validators.required, Validators.pattern("[0-9]*")]],
    });
  }

  updateevent() {
    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editPolyTag`;
      var data1 = {
        polytag_id: this.polytag_id,
        polytag_name: this.polytag_name,
        score: this.score,
      };

      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)

        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
        });

        this.dialogRef.close();
      });
    }
  }

  closeDialog(group) {
    this.dialogRef.close(group);
  }
}


