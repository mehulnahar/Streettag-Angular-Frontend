import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
  AfterViewInit
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
import * as L from 'leaflet';

// import {DeletedialogLocation} from '../../DeletedialogLocation/DeletedialogLocation.component';

//declare var $:any;

interface StreetTag {
  id: number;
  street_name: string;
  score: number;
  start_date: string;
  end_date: string;
  qr_img: string;
  scan_type: string;
}

interface ApiResponse<T> {
  response: T;
  status: boolean;
  message: string;
}

interface Location {
  id: number;
  location_name: string;
  created_at: string;
}

@Component({
  selector: "app-event",
  templateUrl: "./streettags.component.html",
  styleUrls: ["./streettags.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class StreettagsComponent implements OnInit, AfterViewInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  public newMail!: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form!: FormGroup;

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
  public dataSource: MatTableDataSource<StreetTag>;
  public dataSourceLocation: any;
  public selectedValue!: string;
  public foods = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
  ];

  streettag_id: string = '';

  private map!: L.Map;
  public marker?: L.Marker;

  public mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }),
    ],
    zoom: 7,
    center: L.latLng(51.5339834, 0.0753218)
  };

  private baseMaps = {
    'Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }),
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: '© Esri'
    })
  };

  private defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<StreetTag>([]);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(filterValue: string) {
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
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
  openEditDialog(event:any): void {
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
    this.ajaxService.get<ApiResponse<Location[]>>(url).subscribe((response) => {
      this.dataSourceLocation = response.response;
    });
  }

  ///////////////get all event//////////////////
  getallCircuits() {
    const url = `${this.baseUrl}getStreetTags`;
    this.ajaxService.get<ApiResponse<StreetTag[]>>(url).subscribe((response) => {
      this.dataSource = new MatTableDataSource<StreetTag>(response.response);
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

  deleteCircuit(circuit_id: number) {
    var url = `${this.baseUrl}deleteStreetTag`;
    var data = { streettag_id: circuit_id };

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
      this.resData = response;
      this.getallCircuits();

      this.snackBar.open("StreetTag deleted Successfully!", " ", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["blue-snackbar"],
      });
    });
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.addMarker();
    
    // Add layer control
    L.control.layers(this.baseMaps).addTo(this.map);
    
    // Set default layer
    this.baseMaps['Map'].addTo(this.map);
  }

  addMarker() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([this.lat, this.lng], {
      draggable: true,
      icon: this.defaultIcon
    });
    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
    });
    this.marker.addTo(this.map);
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
  styleUrls: ["dialog-overview-addmessage-dialog.scss"]
})
export class DialogOverviewAddMessageDialogStreettags implements OnInit {
  private defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  public lat: number = 51.5339834;
  public lng: number = 0.0753218;
  public zoom: number = 7;
  public settings!: Settings;
  angForm!: FormGroup;
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
  private map!: L.Map;
  public marker?: L.Marker;
  public mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }),
    ],
    zoom: 7,
    center: L.latLng(51.5339834, 0.0753218)
  };

  private baseMaps = {
    'Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }),
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: '© Esri'
    })
  };

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogStreettags>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { groups: any[] },
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getallLocations();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.addMarker();
    
    // Add layer control
    L.control.layers(this.baseMaps).addTo(this.map);
    
    // Set default layer
    this.baseMaps['Map'].addTo(this.map);
  }

  onMapClick(e: L.LeafletMouseEvent) {
    this.lat = e.latlng.lat;
    this.lng = e.latlng.lng;
    this.angForm.patchValue({
      lat: this.lat,
      lng: this.lng
    });
    this.addMarker();
  }

  addMarker() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([this.lat, this.lng], {
      draggable: true,
      icon: this.defaultIcon
    });
    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
    });
    this.marker.addTo(this.map);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallBuilding() {
    var url = `${this.baseUrl}getBuildings`;
    this.ajaxService.get<ApiResponse<any>>(url).subscribe((data) => {
      this.dataSourceBuilding = data.response;
    });
  }

  getallCircuits() {
    var url = `${this.baseUrl}getStreetTags`;
    this.ajaxService.get<ApiResponse<any>>(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data.response);
    });
  }

  getallLocations() {
    var url = `${this.baseUrl}getLocations`;
    this.ajaxService.get<ApiResponse<any>>(url).subscribe((data) => {
      this.dataSourceLocation = data.response;
    });
  }

  setlocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.angForm.patchValue({
          lat: this.lat,
          lng: this.lng
        });
        if (this.map) {
          this.map.setView([this.lat, this.lng], 15);
          this.addMarker();
        }
      });
    }
  }

  checkBuildingQrValue(res: any) {
    this.is_building_qr_value = res.checked;
    this.angForm.patchValue({
      is_building_qr: res.checked
    });
    if (this.is_building_qr_value == true) {
      this.check_is_building_qr = true;
      this.getallBuilding();
    } else {
      this.check_is_building_qr = false;
    }
  }

  createForm() {
    this.angForm = this.formBuilder.group({
      street_name: ["", Validators.required],
      score: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      lat: ["", Validators.required],
      lng: ["", Validators.required],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      location: [""],
      scan_type: [2],
      max_scan: [1],
      is_building_qr: [false],
      building_id: [""],
      floor_id: [""]
    });

    // Subscribe to form value changes to update the class properties
    this.angForm.get('street_name')?.valueChanges.subscribe(val => this.street_name = val);
    this.angForm.get('score')?.valueChanges.subscribe(val => this.score = val);
    this.angForm.get('lat')?.valueChanges.subscribe(val => this.lat = val);
    this.angForm.get('lng')?.valueChanges.subscribe(val => this.lng = val);
    this.angForm.get('start_date')?.valueChanges.subscribe(val => this.start_date = val);
    this.angForm.get('end_date')?.valueChanges.subscribe(val => this.end_date = val);
  }

  checkScanType(res: any) {
    this.angForm.patchValue({
      scan_type: res
    });
    if (res == 1) {
      this.select_scan_id = true;
    } else {
      this.select_scan_id = false;
    }
  }

  get_buiding_id(res: any) {
    this.building_id = res;
    this.angForm.patchValue({
      building_id: res
    });
  }

  getFloors(res: any) {
    var url = `${this.baseUrl}getFloors`;
    var data = { building_id: res };
    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((data) => {
      this.dataSourceFloors = data.response;
    });
  }

  addevent(): void {
    if (this.angForm.valid) {
      var url = `${this.baseUrl}addStreetTag`;
      var formValue = this.angForm.value;
      var data = {
        street_name: formValue.street_name,
        score: formValue.score,
        lat: formValue.lat,
        lng: formValue.lng,
        start_date: formValue.start_date,
        end_date: formValue.end_date,
        scan_type: formValue.scan_type,
        max_scan: formValue.max_scan,
        is_building_qr: formValue.is_building_qr,
        building_id: formValue.building_id,
        floor_id: formValue.floor_id,
      };

      this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
        this.resData = response;
        if (response.status) {
          this.snackBar.open("StreetTag Added Successfully!", "", {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.dialogRef.close();
        }
      });
    }
  }
}

@Component({
  selector: "dialog-overview-message-dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogStreettags {
  allLocations = [] as any;
  angForm: FormGroup;
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_name = "";
  street_name = "";
  streettag_id = "";
  location_id = "";
  no_of_QR = "";
  public zoom: number = 7;
  public settings!: Settings;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogStreettags>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { event: StreetTag },
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    // Initialize form with existing data
    this.angForm = this.formBuilder.group({
      street_name: [data.event.street_name, Validators.required],
      start_date: [new Date(data.event.start_date), Validators.required],
      end_date: [new Date(data.event.end_date), Validators.required]
    });
    
    this.streettag_id = data.event.id.toString();
    this.getallLocations();
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get<ApiResponse<Location[]>>(url).subscribe((response) => {
      this.allLocations = response.response;
    });
  }

  updateevent() {
    if (this.angForm.valid) {
      const formData = this.angForm.value;
      const url = `${this.baseUrl}updateStreetTag`;
      
      const payload = {
        street_name: formData.street_name,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0],
        streettag_id: this.streettag_id
      };

      this.ajaxService.post<ApiResponse<any>>(url, JSON.stringify(payload)).subscribe(
        (response) => {
          if (response.status) {
            this.snackBar.open('Street Tag Updated Successfully!', 'Close', {
              duration: 2000,
            });
            this.dialogRef.close();
          } else {
            this.snackBar.open('Error Updating Street Tag', 'Close', {
              duration: 2000,
            });
          }
        },
        (error) => {
          this.snackBar.open('Error Updating Street Tag', 'Close', {
            duration: 2000,
          });
        }
      );
    } else {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 2000,
      });
    }
  }
}
