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
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';

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

interface UpdateStreetTagPayload {
  street_name: string;
  start_date: string;
  end_date: string;
  streettag_id: string;
}

interface MapResponse {
  location: any;
  viewport: any;
  viewportInfo: any;
}

interface PaginatedResponse {
  response: StreetTag[];
  status: string;
  total: number;
}

@Component({
  selector: "app-event",
  templateUrl: "./streettags.component.html",
  styleUrls: ["./streettags.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
  styles: [`
    ::ng-deep .large-dialog .mat-dialog-container {
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    ::ng-deep .large-dialog .mat-dialog-content {
      max-height: calc(90vh - 120px);
    }
  `]
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

  private readonly GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;

  public totalItems: number = 0;
  public isLoading: boolean = false;

  // Add new property to store full dataset
  private fullDataset: StreetTag[] = [];

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private ajaxService: AjaxService,
    private http: HttpClient
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<StreetTag>([]);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.onPageChange(event);
      });
    }

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.getallCircuits();
      });
    }
  }

  applyFilter(filterValue: string) {
    if (this.dataSource) {
      filterValue = filterValue.trim().toLowerCase();
      
      // Filter the full dataset
      const filteredData = this.fullDataset.filter(item => 
        item.street_name.toLowerCase().includes(filterValue) ||
        item.score.toString().includes(filterValue) ||
        item.start_date.toLowerCase().includes(filterValue) ||
        item.end_date.toLowerCase().includes(filterValue)
      );

      // Update total items for pagination
      this.totalItems = filteredData.length;

      // Get current page
      const pageIndex = this.paginator?.pageIndex ?? 0;
      const pageSize = this.paginator?.pageSize ?? 10;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;

      // Update data source with paginated filtered data
      this.dataSource = new MatTableDataSource<StreetTag>(
        filteredData.slice(startIndex, endIndex)
      );
      
      // Reset to first page when filtering
      if (this.paginator) {
        this.paginator.firstPage();
      }
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
    let dialogRef = this.dialog.open(DialogOverviewMessageDialogStreettags, {
      width: '600px',
      maxWidth: '90vw',
      // panelClass: 'modern-dialog',
      data: { event },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogStreettags, {
      data: { groups: this.groupList.result },
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'large-dialog'
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

  getallCircuits() {
    const url = `${this.baseUrl}getStreetTags`;
    
    this.isLoading = true;
    
    this.ajaxService.get<PaginatedResponse>(url).subscribe(
      (response) => {
        if (response.status === "true") {
          // Store full dataset
          this.fullDataset = response.response;
          this.totalItems = this.fullDataset.length;

          // Calculate pagination
          const pageIndex = this.paginator?.pageIndex ?? 0;
          const pageSize = this.paginator?.pageSize ?? 10;
          const startIndex = pageIndex * pageSize;
          const endIndex = startIndex + pageSize;

          // Get current page data
          const paginatedData = this.fullDataset.slice(startIndex, endIndex);
          
          // Update data source with paginated data
          this.dataSource = new MatTableDataSource<StreetTag>(paginatedData);
          
          // Set up sorting
          this.dataSource.sort = this.sort;

          // Set up filtering
          this.dataSource.filterPredicate = (data: StreetTag, filter: string) => {
            return data.street_name.toLowerCase().includes(filter) ||
                   data.score.toString().includes(filter) ||
                   data.start_date.toLowerCase().includes(filter) ||
                   data.end_date.toLowerCase().includes(filter);
          };
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.snackBar.open('Error loading data. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    );
  }

  // Update page change handler
  onPageChange(event: any) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    
    // Calculate new page indices
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Get page data from full dataset
    const paginatedData = this.fullDataset.slice(startIndex, endIndex);
    
    // Update data source with new page data
    this.dataSource = new MatTableDataSource<StreetTag>(paginatedData);
    
    // Maintain sorting
    this.dataSource.sort = this.sort;
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

  // Add new methods for Google Maps API calls
  async getGeocode(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`;
    return this.http.get(url).toPromise();
  }

  async getViewportInfo(bounds: number[][], zoom: number) {
    const url = 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo';
    const payload = [
      bounds,
      zoom,
      null,
      "en-US",
      0,
      "m@720000000",
      0,
      0,
      null,
      null,
      null,
      2
    ];
    return this.http.post(url, payload).toPromise();
  }

  async setLocationWithMaps(address: string): Promise<MapResponse | null> {
    try {
      // First get geocode data
      const geocodeResponse: any = await this.getGeocode(address);
      
      if (geocodeResponse.results && geocodeResponse.results.length > 0) {
        const location = geocodeResponse.results[0].geometry.location;
        const viewport = geocodeResponse.results[0].geometry.viewport;
        
        // Get viewport bounds
        const bounds = [
          [viewport.southwest.lat, viewport.southwest.lng],
          [viewport.northeast.lat, viewport.northeast.lng]
        ];
        
        // Get viewport info
        const viewportInfo = await this.getViewportInfo(bounds, 10);
        
        // Update map position
        this.lat = location.lat;
        this.lng = location.lng;
        this.zoom = 10;
        
        return {
          location: location,
          viewport: viewport,
          viewportInfo: viewportInfo
        };
      }
      return null;
    } catch (error) {
      console.error('Error setting location:', error);
      throw error;
    }
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html"
})
export class DialogOverviewAddMessageDialogStreettags implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapMarker) marker!: MapMarker;

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

  // Google Maps options
  public center!: { lat: number; lng: number };
  public markerPosition!: { lat: number; lng: number };
  public mapOptions: google.maps.MapOptions = {
    zoom: 7,
    mapTypeControl: true,
    streetViewControl: false,
    mapTypeId: 'roadmap'
  };
  public markerOptions: google.maps.MarkerOptions = {
    draggable: true
  };

  private readonly GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogStreettags>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { groups: any[] },
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.center = { lat: this.lat, lng: this.lng };
    this.markerPosition = { lat: this.lat, lng: this.lng };
    this.createForm();
  }

  ngOnInit() {
    this.getallLocations();
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.lat = event.latLng.lat();
      this.lng = event.latLng.lng();
      this.markerPosition = { lat: this.lat, lng: this.lng };
      this.center = this.markerPosition;
      this.angForm.patchValue({
        lat: this.lat,
        lng: this.lng
      });
    }
  }

  onMarkerPositionChanged(position: google.maps.LatLng | null) {
    if (position) {
      this.lat = position.lat();
      this.lng = position.lng();
      this.markerPosition = { lat: this.lat, lng: this.lng };
      this.center = this.markerPosition;
      this.angForm.patchValue({
        lat: this.lat,
        lng: this.lng
      });
    }
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

  async setlocation() {
    try {
      const locationValue = this.angForm.get('location')?.value;
      if (locationValue) {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode(
          { address: locationValue },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results && results.length > 0) {
              const location = results[0].geometry.location;
              
              // Update map position
              this.center = {
                lat: location.lat(),
                lng: location.lng()
              };
              
              this.markerPosition = {
                lat: location.lat(),
                lng: location.lng()
              };

              // Update form values
              this.angForm.patchValue({
                lat: location.lat(),
                lng: location.lng()
              });
              
              // Update map zoom
              if (this.map) {
                this.map.zoom = 15;
              }

              this.snackBar.open('Location set successfully', 'Close', {
                duration: 3000
              });
            } else {
              this.snackBar.open('Location not found', 'Close', {
                duration: 3000
              });
            }
          }
        );
      } else {
        this.snackBar.open('Please enter a location name', 'Close', {
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error setting location:', error);
      this.snackBar.open('Error setting location. Please try again.', 'Close', {
        duration: 3000
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
    this.angForm = this.fb.group({
      street_name: ['', Validators.required],
      score: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      location: [''],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      scan_type: [2],
      max_scan: [1],
      is_building_qr: [false],
      building_id: [''],
      floor_id: ['']
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
  templateUrl: "dialog-overview-message-dialog.html"
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
      const url = `${this.baseUrl}editStreetTag`;
      
      const formatStartDate = (date: Date | string) => {
        if (date instanceof Date) {
          return date.toISOString();
        }
        return date;
      };

      const formatEndDate = (date: Date | string) => {
        if (date instanceof Date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return date;
      };
      
      const payload = {
        street_name: formData.street_name,
        start_date: formatStartDate(formData.start_date),
        end_date: formatEndDate(formData.end_date),
        streettag_id: this.streettag_id
      };

      console.log('Updating street tag at:', url); // Debug log
      console.log('With payload:', payload); // Debug log

      this.ajaxService.post(payload, url).subscribe(
        (response: any) => {
          console.log('Update response:', response); // Debug log
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
          console.error('Update error:', error);
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
