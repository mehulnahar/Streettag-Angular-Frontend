import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

// import {DeletedialogLocation} from '../../DeletedialogLocation/DeletedialogLocation.component';

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./streettags.component.html",
  styleUrls: ["./streettags.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class StreettagsComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
    "street_name",
    "score",
    "start_date",
    "end_date",
    "qr_img",
    "edit",
    "delete",
  ];
  public dataSource: any;
  public dataSourceLocation: any;
  public selectedValue: string;
  public foods = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
  ];
  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;

  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallCircuits();

    this.form = this.formBuilder.group({
      to: ["", Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
    }
  }

  ////////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    //event.location = this.dataSourceLocation;
    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewMessageDialogStreettags, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogStreettags, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
    });
  }
  ///////////////get all event//////////////////
  getallCircuits() {
    const url = `${this.baseUrl}getStreetTags`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  confirmDialog(data:any): void {
    const message = `Are you sure you want to delete ${data.street_name} street tag?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteCircuit(data.id);
      }
    });
  }

  deleteCircuit(circuit_id :number) {
    var url = `${this.baseUrl}deleteStreetTag`;
    var data = { streettag_id: circuit_id };

    this.ajaxService.post(data, url).subscribe((data) => {
      this.resData = data;
      this.getallCircuits();

      this.snackBar.open("StreetTag deleted Successfully!", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["blue-snackbar"],
      });
    });
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogStreettags {
  public lat: number = 51.5339834;
  public lng: number = 0.0753218;
  public zoom: number = 7;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  circuit_name = "";
  no_of_QR = "";
  start_date = "";
  end_date = "";
  location = "";
  street_name = "";
  score = "";
  max_scan = 1;
  select_scan_id: any;
  scan_type = 2;
  is_building_qr = false;
  check_is_building_qr = false;
  check_building_validation = 0;
  public dataSourceLocation: any;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  public dataSourceBuilding: any;
  public dataSourceFloors: any;
  building_name = "";
  floor_name = "";
  building_id: any;
  is_building_qr_value: any;
  val: any;
  private readonly baseUrl = environment.baseUrl;
  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogStreettags>,
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
    this.getallLocations();

    this.getallBuilding();
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallBuilding() {
    ////console.log("here inside conact details");

    var url = `${this.baseUrl}getBuilding`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceBuilding = data["response"];
      //console.log(545454545454);
      //console.log(this.dataSourceBuilding);
    });
  }

  getallCircuits() {
    ////console.log("here inside conact details");

    var url = `${this.baseUrl}getCircuits`;

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log("all Locations:");
      //console.log(this.dataSource)
    });
  }

  getallLocations() {
    ////console.log("here inside conact details");

    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      //console.log(545454545454);
      //console.log(this.dataSourceLocation);
    });
  }

  markerDragEnd($event: any) {
    //console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
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
      street_name: ["", [Validators.required]],
      score: ["", [Validators.required, Validators.pattern("[0-9]*")]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
    });
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

  addevent() {
    //console.log(this.angForm.status);

    if (
      this.check_building_validation == 1 &&
      (this.building_name == "" || this.building_name != "") &&
      this.floor_name == ""
    ) {
      this.snackBar.open("Select Building! and Floor!", null, {
        duration: 3000,
        verticalPosition: "top",
      });
      return false;
    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}addStreetTag`;
      if (this.is_building_qr) {
        this.is_building_qr_value = 1;
      } else {
        this.is_building_qr_value = 0;
      }
      if (this.scan_type == 2) {
        this.building_name = "";
        this.floor_name = "";
        this.max_scan = 0;
        this.is_building_qr_value = 0;
      }
      var data1 = {
        street_name: this.street_name,
        score: this.score,
        lat: this.lat,
        lng: this.lng,
        scan_type: this.scan_type,
        start_date: this.start_date,
        end_date: this.end_date,
        max_scan: this.max_scan,
        is_building_qr: this.is_building_qr_value,
        building_id: this.building_name,
        floor_id: this.floor_name,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      //console.log('step1');

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getallCircuits();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogStreettags {
  allLocations = [] as any;
  form: FormGroup;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_name = "";
  street_name = "";
  streettag_id = "";
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
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogStreettags>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.location_name = this.data.event.location_name;
    this.street_name = this.data.event.street_name;
    this.streettag_id = this.data.event.id;

    this.start_date = this.data.event.start_date;
    this.end_date = this.data.event.end_date;

    this.getallLocations();
    //console.log("saeeeeeee");
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

  getallLocations() {
    ////console.log("here inside conact details");

    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      //console.log(545454545454);
      //console.log(this.dataSourceLocation);
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      street_name: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
    });
  }

  updateevent() {
    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editStreetTag`;
      var data1 = {
        streettag_id: this.streettag_id,
        street_name: this.street_name,

        start_date: this.start_date,
        end_date: this.end_date,
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
