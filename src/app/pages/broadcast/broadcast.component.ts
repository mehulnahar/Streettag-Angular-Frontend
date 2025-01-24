import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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

@Component({
  selector: "app-broadcast",
  templateUrl: "./broadcast.component.html",
  styleUrls: ["./broadcast.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BroadcastComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  private readonly baseUrl = environment.baseUrl;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "circuit_name",
    "location_name",
    "authority_email",
    "geoLocation",
    "action",
  ];
  public dataSource: any;

  constructor(
    private appSettings: AppSettings,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getallCircuits();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMessageDialog() {
    let dialogRef = this.dialog.open(DialogAddBroadcast, {});
    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }

  opengeofence(data) {
    let dialogRef = this.dialog.open(DialogAddBroadcastLocation, {
      data: { data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }

  openDialog(id, flag, email, radius): void {
    console.log(radius);
    if (email == "" || email == undefined) {
      this.snackBar.open(
        "Please Provide Authority Email before Enabling the broadcast.",
        null,
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["warn-snackbar"],
        }
      );
      return;
    }
    if (radius == "" || radius == undefined || radius == 0) {
      this.snackBar.open(
        "Please Provide Geo-location before Enabling the broadcast.",
        null,
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["warn-snackbar"],
        }
      );
      return;
    } else {
      let dialogRef = this.dialog.open(Acceptancedialog, {
        data: { id, flag },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.id != 0) {
          this.updateBroadcast(result);
        }
      });
    }
  }

  updateBroadcast(dataobj) {
    const url = `${this.baseUrl}OnOffBroadcast`;
    this.ajaxService.post(dataobj, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        let msg = "Broadcasting Enabled.";
        if (dataobj.flag == 0) {
          msg = "Broadcasting Disabled.";
        }
        this.snackBar.open(msg, null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        this.snackBar.open("Something went wrong!", null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openBroadcastDialog() {
    let dialogRef = this.dialog.open(DialogBroadcastList, {
      disableClose: true,
      height: "580px",
      width: "1200px",
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}

@Component({
  selector: "app-blank",
  templateUrl: "./acceptance-pop-up.html",
})
export class Acceptancedialog {
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<Acceptancedialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(x) {
    this.dialogRef.close(x);
  }
}

@Component({
  selector: "add-broadcast",
  templateUrl: "./broadcast-add.html",
  styleUrls: ["./broadcast.component.scss"],
})
export class DialogAddBroadcast {
  clicked = false;
  resData: any;
  angForm: FormGroup;
  public dataSource1: any;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<DialogAddBroadcast>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getallCircuits();
    this.createForm();
  }

  get_email(id) {
    var result = this.dataSource1.find((a) => a.id == id);
    this.angForm.controls["email"].setValue(result.broadcast_authority_email);
  }

  createForm() {
    this.angForm = this.fb.group({
      circuit: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
      ],
    });
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource1 = data["response"];
    });
  }

  addCharityData() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}addAuthorityEmail`;
      var data = {
        authority_email: this.angForm.value.email,
        circuit_id: this.angForm.value.circuit,
      };
      this.ajaxService.post(data, url).subscribe(
        (data) => {
          this.resData = data;
          let dynamicSnackColor = "blue-snackbar";
          let msg = "Authority Email submitted successfully.";
          if (this.resData.status == "false") {
            dynamicSnackColor = "red-snackbar";
            msg = "Something went wrong, please try again";
          }
          this.snackBar.open(msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open("Failed to load!", null, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }
}

@Component({
  selector: "add-location",
  templateUrl: "./broadcast-location.html",
  styleUrls: ["./broadcast.component.scss"],
})
export class DialogAddBroadcastLocation implements OnInit {
  clicked = false;
  resData: any;
  angForm: FormGroup;
  public dataSource1: any;
  public default_lat: Number = 51.5339834;
  public default_lng: Number = 0.0753218;
  public location = "";
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogAddBroadcastLocation>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
    this.getGeoLocation(this.data.data);
    console.log(this.data.data.id);
  }

  ngOnInit() {}

  createForm() {
    this.angForm = this.fb.group({
      circuit_id: [this.data.data.id],
      radius: [500],
      lat: [0],
      lng: [0],
    });
  }

  getGeoLocation($event) {
    if (
      $event != undefined &&
      $event != null &&
      $event.broadcast_lat != "" &&
      $event.broadcast_lng != 0
    ) {
      this.angForm.controls["lat"].setValue(parseFloat($event.broadcast_lat));
      this.angForm.controls["lng"].setValue(parseFloat($event.broadcast_lng));
      this.angForm.controls["radius"].setValue(
        parseInt($event.broadcast_radius)
      );
      this.default_lat = parseFloat($event.broadcast_lat);
      this.default_lng = parseFloat($event.broadcast_lng);
    } else {
      this.angForm.controls["lat"].setValue(parseInt("0"));
      this.angForm.controls["lng"].setValue(parseInt("0"));
      this.angForm.controls["radius"].setValue(parseInt("500"));
      this.default_lat = 51.5339834;
      this.default_lng = 0.0753218;
    }
  }

  markerDragEnd($event: any) {
    this.angForm.controls["lat"].setValue(parseFloat($event.coords.lat));
    this.angForm.controls["lng"].setValue(parseFloat($event.coords.lng));
  }

  radiusChange($event) {
    this.angForm.controls["radius"].setValue(Math.round($event));
  }

  addlocation() {
    if (this.angForm.status == "VALID") {
      if (this.angForm.value.lat == 0 || this.angForm.value.lng == 0) {
        this.snackBar.open("Please select location.", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        return;
      }
      this.clicked = true;
      const url = `${this.baseUrl}addEditGeoLocation`;
      this.ajaxService.post(this.angForm.value, url).subscribe(
        (data) => {
          this.resData = data;
          let dynamicSnackColor = "blue-snackbar";
          let msg = "Geo Location Submitted Successfully.";
          if (this.resData.status == "false") {
            dynamicSnackColor = "red-snackbar";
            msg = "Something went wrong, please try again";
          }
          this.snackBar.open(msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open("Failed to load!", null, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }

  setlocation() {
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      this.location +
      "&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8";
    this.ajaxService.getLocation(url).subscribe((data: any) => {
      if (
        typeof data != "undefined" &&
        data != "" &&
        typeof data.results != "undefined" &&
        data.results != ""
      ) {
        var lattitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;
        this.angForm.controls["lat"].setValue(parseFloat(lattitude));
        this.angForm.controls["lng"].setValue(parseFloat(longitude));
        this.default_lat = lattitude;
        this.default_lng = longitude;
      }
    });
  }
}

@Component({
  selector: "broadcast-list",
  templateUrl: "./Broadcast-list.html",
  styles: [
    ".mat-column-created_at,.mat-column-category, .mat-column-image {max-width: 170px};",
  ],
})
export class DialogBroadcastList {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns = [
    "category",
    "description",
    "address",
    "image",
    "created_at",
  ];
  public b_dataSource: any;
  public spiner: boolean = true;
  private readonly baseUrl = environment.baseUrl;
    categoryArray = [
    { value: 0, name: "Running Broadcast" },
    { value: 1, name: "Approved Broadcast" },
    { value: 2, name: "Rejected Broadcast" },
  ];
  constructor(
    public dialogRef: MatDialogRef<DialogBroadcastList>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.getBroadcastList(0);
  }

  async getBroadcastList(SelectedCategory) {
    this.spiner = true;
    const url =
      `${this.baseUrl}getBroadcastList`;
    var data = { category: SelectedCategory };
    this.ajaxService.post(data, url).subscribe(async (data) => {
      this.b_dataSource = new MatTableDataSource<Element>(
        await data["response"]
      );
      this.b_dataSource.paginator = this.paginator;
      this.paginator.pageIndex = 0;
      this.b_dataSource.sort = this.sort;
      this.spiner = false;
    });
  }
}
