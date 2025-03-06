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
import { GoogleMap } from '@angular/google-maps';

interface BroadcastData {
  id: number;
  broadcast_lat: string;
  broadcast_lng: string;
  broadcast_radius: string;
}

interface ApiResponse<T> {
  status: boolean;
  response: T;
  msg?: string;
}

interface Circuit {
  id: number;
  serial_number: number;
  circuit_name: string;
  location_name: string;
  broadcast_authority_email: string;
  broadcast_radius: string;
  broadcast_lat: string;
  broadcast_lng: string;
}

@Component({
  selector: "app-broadcast",
  templateUrl: "./broadcast.component.html",
  styleUrls: ["./broadcast.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BroadcastComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form! : FormGroup;
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

  opengeofence(data: any) {
    let dialogRef = this.dialog.open(DialogAddBroadcastLocation, {
      data: { data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }

  openDialog(id: any, flag: any, email: any, radius: any): void {
    console.log(radius);
    if (email == "" || email == undefined) {
      this.snackBar.open(
        "Please Provide Authority Email before Enabling the broadcast.",
        undefined,
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
        undefined,
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

  updateBroadcast(dataobj:any) {
    const url = `${this.baseUrl}OnOffBroadcast`;
    this.ajaxService.post(dataobj, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        let msg = "Broadcasting Enabled.";
        if (dataobj.flag == 0) {
          msg = "Broadcasting Disabled.";
        }
        this.snackBar.open(msg, undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        this.snackBar.open("Something went wrong!", undefined, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;
    this.ajaxService.get<ApiResponse<Circuit[]>>(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.response);
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

  Submit(x:any) {
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
  angForm!: FormGroup;
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

  get_email(id:any) {
    var result = this.dataSource1.find((a:any) => a.id == id);
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
    this.ajaxService.get<ApiResponse<Circuit[]>>(url).subscribe((data) => {
      this.dataSource1 = data.response;
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
          this.snackBar.open(msg, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open("Failed to load!", undefined, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, undefined, {
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
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('circle') circle: any;
  clicked = false;
  resData: any;
  angForm: FormGroup = this.createForm();
  public dataSource1: any;
  private readonly baseUrl = environment.baseUrl;
  public location: string = '';

  // Google Maps properties
  center: google.maps.LatLngLiteral = { lat: 51.5339834, lng: 0.0753218 };
  zoom = 13;
  markerPosition: google.maps.LatLngLiteral = { lat: 51.5339834, lng: 0.0753218 };
  currentRadius: number = 500;

  // Add marker options property
  markerOptions = {
    draggable: true,
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new google.maps.Size(40, 40)
    }
  };

  // Add circle options property with proper typing
  circleOptions: google.maps.CircleOptions = { 
    fillColor: '#ff4081', 
    strokeColor: '#ff4081', 
    fillOpacity: 0.3,
    strokeWeight: 2,
    editable: true,
    draggable: true
  };

  constructor(
    public dialogRef: MatDialogRef<DialogAddBroadcastLocation>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { data: BroadcastData },
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getGeoLocation(this.data.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  createForm(): FormGroup {
    return this.fb.group({
      circuit_id: [this.data?.data?.id || null],
      radius: [500, [Validators.required, Validators.min(1)]],
      lat: [0],
      lng: [0],
    });
  }

  getGeoLocation(event: BroadcastData): void {
    if (
      event != undefined &&
      event != null &&
      event.broadcast_lat != "" &&
      event.broadcast_lng != "0"
    ) {
      const lat = parseFloat(event.broadcast_lat);
      const lng = parseFloat(event.broadcast_lng);
      const radius = parseInt(event.broadcast_radius) || 500;
      this.currentRadius = radius;
      this.angForm.patchValue({
        lat: lat,
        lng: lng,
        radius: radius
      });
      this.center = { lat, lng };
      this.markerPosition = { lat, lng };
    } else {
      this.currentRadius = 500;
      this.angForm.patchValue({
        lat: 0,
        lng: 0,
        radius: 500
      });
      this.center = { lat: 51.5339834, lng: 0.0753218 };
      this.markerPosition = { lat: 51.5339834, lng: 0.0753218 };
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.updatePosition(lat, lng);
    }
  }

  onRadiusChange(event: any) {
    if (event && event.radius) {
      const newRadius = Math.round(event.radius);
      this.currentRadius = newRadius;
      this.angForm.patchValue({
        radius: newRadius
      }, { emitEvent: false });
    }
  }

  onCenterChange(event: any) {
    if (event && event.center) {
      const lat = event.center.lat();
      const lng = event.center.lng();
      this.updatePosition(lat, lng);
    }
  }

  onRadiusInput(newRadius: number) {
    if (!isNaN(newRadius) && newRadius > 0) {
      this.currentRadius = newRadius;
      this.angForm.patchValue({
        radius: newRadius
      }, { emitEvent: false });
      if (this.circle) {
        this.circle.setRadius(newRadius);
      }
    }
  }

  private updatePosition(lat: number, lng: number) {
    this.markerPosition = { lat, lng };
    this.center = { lat, lng };
    this.angForm.patchValue({
      lat: lat,
      lng: lng
    });
  }

  markerDragEnd(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.updatePosition(lat, lng);
    }
  }

  addlocation() {
    if (this.angForm.status == "VALID") {
      if (this.angForm.value.lat == 0 || this.angForm.value.lng == 0) {
        this.snackBar.open("Please select location.", undefined, {
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
          this.snackBar.open(msg, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open("Failed to load!", undefined, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, undefined, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }

  setlocation() {
    if (!this.location) {
      this.snackBar.open('Please enter a location', undefined, {
        duration: 2000,
        verticalPosition: 'top'
      });
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        this.updatePosition(lat, lng);
        
        this.snackBar.open('Location set successfully', undefined, {
          duration: 2000,
          verticalPosition: 'top'
        });
      } else {
        this.snackBar.open('Location not found. Please try again.', undefined, {
          duration: 2000,
          verticalPosition: 'top'
        });
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
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
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

  async getBroadcastList(SelectedCategory: number) {
    this.spiner = true;
    const url = `${this.baseUrl}getBroadcastList`;
    const data = { category: SelectedCategory };
    this.ajaxService.post<ApiResponse<any[]>>(data, url).subscribe(async (response) => {
      this.b_dataSource = new MatTableDataSource(response.response);
      this.b_dataSource.paginator = this.paginator;
      this.paginator.pageIndex = 0;
      this.b_dataSource.sort = this.sort;
      this.spiner = false;
    });
  }
}
