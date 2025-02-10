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
import { Observable, map } from "rxjs";
import { GoogleMap } from '@angular/google-maps';
import { HttpClient } from "@angular/common/http";
import { MapInfoWindow } from "@angular/google-maps";

interface PolyTag {
  id: number;
  polytag_name: string;
  score: number;
  category: string;
  asset_name: string;
  created_at: string;
  lat: string;
  lng: string;
}

interface ApiResponse<T> {
  response: T;
  status: boolean;
  msg: string;
}

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./polytags.component.html",
  styleUrls: ["./polytags.component.scss"],
  // encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class PolytagsComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav!: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(GoogleMap) map!: GoogleMap;
  public settings!: Settings;
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
    "polytag_name",
    "score",
    "category",
    "asset_name",
    "edit",
    "delete",
  ]; // 'start_date', 'end_date',
  public dataSource: MatTableDataSource<PolyTag>;
  public dataSourceLocation: any;
  public selectedValue!: string;
  public spinner = true;

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
    this.dataSource = new MatTableDataSource<PolyTag>([]);
    this.spinner;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
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
  openEditDialog(event: PolyTag): void {
    //event.location = this.dataSourceLocation;
    //console.log("edit called");
    const dialogRef = this.dialog.open(DialogEditPolytags, {
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
    const dialogRef = this.dialog.open(DialogOverviewAddMessageDialogPolytags, {
      width: '600px',
      maxWidth: '90vw'
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
    this.ajaxService.get<ApiResponse<PolyTag[]>>(url).subscribe({
      next: (response) => {
        if (response.status) {
          this.dataSource = new MatTableDataSource(response.response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        this.snackBar.open("Failed to load polytags!", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"]
        });
      }
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

  deletePolytag(id: number) {
    const url = `${this.baseUrl}deletePolytag`;
    const data = { polytag_id: id };

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe({
      next: (response) => {
        if (response.status) {
          this.getPolyTags();
          this.snackBar.open(response.msg, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"]
          });
        }
      },
      error: (error) => {
        this.snackBar.open("Error deleting polytag", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"]
        });
      }
    });
    // this. getLink();
  }
}

@Component({
  selector: 'dialog-overview-addmessage-dialog',
  templateUrl: 'dialog-overview-addmessage-dialog.html',
})
export class DialogOverviewAddMessageDialogPolytags implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  
  form: FormGroup;
  dataSourceCategory: Observable<any> = new Observable<any>();
  dataSourceCategoryAssets: Observable<any> = new Observable<any>();
  private readonly baseUrl = environment.baseUrl;
  
  // Selected polytag name for info window
  selectedPolytagName: string = '';
  
  // Google Maps properties
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 15; // Increased zoom level
  markerPosition: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  markerOptions: google.maps.MarkerOptions = { 
    draggable: true,
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    }
  };

  // Existing polytags
  nearByLatLng: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogPolytags>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      category_id: ['', Validators.required],
      asset_id: ['', Validators.required],
      title: ['', Validators.required],
      score: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      location: ['', Validators.required],
      lat: [this.markerPosition.lat, Validators.required],
      lng: [this.markerPosition.lng, Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    // Set initial marker position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.markerPosition = this.center;
        this.zoom = 15;
        this.form.patchValue({
          lat: this.markerPosition.lat,
          lng: this.markerPosition.lng
        });
        this.getNearByTags();
      });
    }
  }

  loadCategories() {
    const url = `${this.baseUrl}getAssetsCategory`;
    this.dataSourceCategory = this.ajaxService.get<ApiResponse<any>>(url).pipe(
      map((response: ApiResponse<any>) => response.response)
    );
  }

  get_category_id(categoryId: string) {
    const url = `${this.baseUrl}getAssetByCategoryId`;
    const data = { category_id: categoryId };

    this.dataSourceCategoryAssets = this.ajaxService.post<ApiResponse<any>>(data, url).pipe(
      map((response: ApiResponse<any>) => response.response)
    );
  }

  getNearByTags() {
    const url = `${this.baseUrl}getNearByTags`;
    const data1 = {
      diameter: "1000",
      lat: this.markerPosition.lat,
      lng: this.markerPosition.lng,
    };

    this.ajaxService.post<ApiResponse<any>>(data1, url).subscribe((data: ApiResponse<any>) => {
      this.nearByLatLng = data.response;
    });
  }

  markerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.form.patchValue({
        lat: this.markerPosition.lat,
        lng: this.markerPosition.lng
      });
      this.getNearByTags();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeEvent(event: any) {
    // Handle location text change
    const location = event.target.value;
    this.form.patchValue({ location });
  }

  setLocation() {
    const location = this.form.get('location')?.value;
    if (location) {
      // Use Google Geocoding service to get coordinates
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const position = results[0].geometry.location;
          this.markerPosition = {
            lat: position.lat(),
            lng: position.lng()
          };
          this.center = this.markerPosition;
          this.zoom = 15;
          this.form.patchValue({
            lat: this.markerPosition.lat,
            lng: this.markerPosition.lng
          });
          this.getNearByTags();
        }
      });
    }
  }

  addevent() {
    if (this.form.valid) {
      const url = `${this.baseUrl}addPolyTag`;
      const data = {
        title: this.form.get('title')?.value,
        score: this.form.get('score')?.value,
        location: this.form.get('location')?.value,
        lat: this.form.get('lat')?.value,
        lng: this.form.get('lng')?.value,
        category_id: this.form.get('category_id')?.value,
        asset_id: this.form.get('asset_id')?.value
      };

      this.ajaxService.post<ApiResponse<any>>(data, url).subscribe({
        next: (response) => {
          if (response.status) {
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  // Get marker options for existing polytags
  getExistingMarkerOptions(polytag: any): google.maps.MarkerOptions {
    return {
      title: polytag.polytag_name
    };
  }

  // Show polytag info when marker is clicked
  showPolytagInfo(polytag: any) {
    this.selectedPolytagName = polytag.polytag_name;
  }
}

@Component({
  selector: 'dialog-edit-polytags',
  templateUrl: 'dialog-editPolytag.html',
})
export class DialogEditPolytags implements OnInit {
  form: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogEditPolytags>,
    @Inject(MAT_DIALOG_DATA) public data: { event: PolyTag },
    private formBuilder: FormBuilder,
    private ajaxService: AjaxService
  ) {
    this.form = this.formBuilder.group({
      polytag_name: [data.event.polytag_name, Validators.required],
      score: [data.event.score, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      const url = `${this.baseUrl}editPolyTag`;
      const data = {
        polytag_id: this.data.event.id,
        polytag_name: this.form.get('polytag_name')?.value,
        score: this.form.get('score')?.value
      };

      this.ajaxService.post<ApiResponse<any>>(data, url).subscribe({
        next: (response) => {
          if (response.status) {
            this.dialogRef.close(true);
          }
        }
      });
    }
  }
}


