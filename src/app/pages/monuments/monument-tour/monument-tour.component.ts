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
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { ImageViewerComponent } from "src/app/shared/image-viewer/image-viewer.component";
import { ImageViewergModel } from "src/app/shared/image-viewer/image-viewer.model";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

interface MonumentTour {
  id: number;
  tour_name: string;
  discription: string;
  lat: string;
  lng: string;
  tour_image?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: number;
  serial_number?: number;
  disable?: boolean;
  monument_id?: number;
}

interface ApiResponse<T> {
  response: T;
  status: string;
  msg?: string;
}

interface Marker {
  position: google.maps.LatLngLiteral;
  options: google.maps.MarkerOptions;
}

interface Monument {
  id: number;
  name: string;
  description: string;
  lat: string;
  lng: string;
  link?: string;
  basketFlag?: boolean;
  address?: string;
  image?: string;
  disable?: boolean;
}

@Component({
  selector: "app-monument-tour",
  templateUrl: "./monument-tour.component.html",
  styleUrls: ["./monument-tour.component.scss"],
})
export class MonumentTourComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav", { static: false }) sidenav!: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form!: FormGroup;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "tour_name",
    "discription",
    "lat",
    "lng",
    "tour_image",
    "created_at",
    "view",
    "edit"
  ];
  public dataSource: MatTableDataSource<MonumentTour>;
  private tourList$?: Subscription;

  constructor(
    private ajaxService: AjaxService,
    private dialog: MatDialog,
    private appSettings: AppSettings,
    public snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<MonumentTour>([]);
  }

  ngOnInit() {
    this.getTourList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTourList() {
    const url = `${environment.baseUrl}getTourList`;
    if (this.tourList$) {
      this.tourList$.unsubscribe();
    }
    this.tourList$ = this.http.get<{response: MonumentTour[]}>(url)
      .pipe(map(response => response.response))
      .subscribe({
        next: (tours) => {
          this.dataSource = new MatTableDataSource(tours);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.snackBar.open(error.error?.msg || 'Error fetching tours', undefined, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        }
      });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(AddTourDialog, {
      width: "60%",
      minHeight: 'calc(100vh - 120px)',
      height: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getTourList();
      }
    });
  }

  openEditDialog(data: MonumentTour): void {
    const dialogRef = this.dialog.open(EditTourDialog, {
      data: { data },
      width: "60%",
      minHeight: 'calc(100vh - 120px)',
      height: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getTourList();
      }
    });
  }

  openDetailDialog(data: MonumentTour): void {
    this.dialog.open(DetailDialog, {
        data,
        width: "40%",
        height: 'auto',
        maxHeight: '70vh',
        disableClose: false,
        position: { top: '50px' },
        autoFocus: true,
        panelClass: 'tour-detail-dialog'
    });
  }

  deleteTour(id: number): void {
    const message = `Are you sure you want to delete this tour?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.ajaxService
          .post({ id }, `${environment.baseUrl}deleteMonumentTour`)
          .subscribe(
            () => {
              this.snackBar.open("Tour deleted successfully", undefined, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: ["blue-snackbar"]
              });
              this.dataSource.data = this.dataSource.data.filter(
                (item) => item.id !== id
              );
            },
            (error) => {
              this.snackBar.open(error.error?.msg || "Error deleting tour", undefined, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: ["red-snackbar"]
              });
            }
          );
      }
    });
  }

  ngOnDestroy() {
    if (this.tourList$) {
      this.tourList$.unsubscribe();
    }
  }
}

@Component({
  selector: "add-tour",
  templateUrl: "./addTour-dialog.html",
  styleUrls: ["./monument-tour.component.scss"],
})
export class AddTourDialog implements OnDestroy {
  @ViewChild('takeInput', {static: false}) InputVar!: ElementRef;
  clicked = false;
  resData: any;
  angForm!: FormGroup;
  public dataSource1: any;
  public Monumentdata: Monument[] = [];
  public disabledLocation: number | null = null;
  filteredOptions: Observable<any> = of([]);
  myControl = new FormControl();
  private readonly baseUrl = environment.baseUrl;
  address: string = '';
  default_lat: number = 51.5339834;
  default_lng: number = 0.0753218;
  lat!: number;
  lng!: number;
  setLocation$!: Subscription;
  add$!: Subscription;
  getMonuments$!: Subscription;
  nearByLatLng$!: Observable<any>;
  zoom: number = 10;
  center: google.maps.LatLngLiteral = {
    lat: this.default_lat,
    lng: this.default_lng
  };
  markers: Marker[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };
  selectedFiles: { preview: string }[] = [];
  isSubmitting = false;
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

  markerDragEnd(event: google.maps.MapMouseEvent | any) {
    if ('coords' in event) {
      // Handle the old format
      this.lat = event.coords.lat;
      this.lng = event.coords.lng;
      this.angForm.get("lat")?.setValue(event.coords.lat);
      this.angForm.get("lng")?.setValue(event.coords.lng);
    } else if (event.latLng) {
      // Handle Google Maps event
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markers[0].position = { lat, lng };
      this.center = { lat, lng };
      this.angForm.get("lat")?.setValue(lat);
      this.angForm.get("lng")?.setValue(lng);
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markers = [{
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        },
        options: {
          draggable: true,
          animation: google.maps.Animation.DROP
        }
      }];
      this.markerDragEnd(event);
    }
  }

  moveMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerDragEnd(event);
    }
  }

  setlocation() {
    if (this.address.trim()) {
        this.snackBar.open('Searching location...', undefined, {
            duration: 2000,
            verticalPosition: 'top'
        });

        // Use Google Maps Geocoding Service
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode(
            { address: this.address },
            (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                    const location = results[0].geometry.location;
                    
                    // Update form values
                    this.lat = location.lat();
                    this.lng = location.lng();
                    this.address = results[0].formatted_address || this.address;
                    
                    // Update map
                    this.center = {
                        lat: location.lat(),
                        lng: location.lng()
                    };
                    
                    // Update markers
                    this.markers = [{
                        position: {
                            lat: location.lat(),
                            lng: location.lng()
                        },
                        options: {
                            draggable: true,
                            animation: google.maps.Animation.DROP
                        }
                    }];
                    
                    // Update form controls
                    this.angForm.patchValue({
                        lat: location.lat(),
                        lng: location.lng()
                    });
                    
                    // Set zoom level for better view
                    this.zoom = 15;
                    
                    this.snackBar.open('Location found!', undefined, {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['green-snackbar']
                    });
                } else {
                    this.snackBar.open('Location not found. Please try a different search.', undefined, {
                        duration: 3000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });
                }
            }
        );
    } else {
        this.snackBar.open('Please enter a location to search', undefined, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
        });
    }
  }

  addMoreLocation() {
    this.location.push(this.fb.control("", Validators.required));
    this.Monumentdata.map((item:any) => {
      if (item.id == this.disabledLocation) item.disable = true;
    });
    this.disabledLocation = null;
  }

  RemoveLocation() {
    let id = this.location.at(this.location.length - 1).value;
    if (this.location.length != 1) {
      this.location.removeAt(this.location.length - 1);
      this.Monumentdata.map((item:any) => {
        if (item.id == id) item.disable = false;
      });
      this.disabledLocation = null;
    }
  }

  async getallMonuments() {
    const url = `${this.baseUrl}getMonuments`;
    this.getMonuments$ = await this.ajaxService
      .get(url)
      .subscribe(async (data: any) => {
        this.Monumentdata = await data["response"];
      });
  }

  remove_monument(data:any) {
    //Storing id in temp variable and when add more location then disable it on this addMoreLocation()
    this.disabledLocation = data;
  }

  handleInputChange(e:any) {
      if(e.target.files[0].type == 'image/jpg' || e.target.files[0].type == 'image/jpeg' || e.target.files[0].type == 'image/png'){
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
      }else{
        this.snackBar.open('Only Images are allowed ( JPG | PNG | JPEG )', undefined, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.InputVar.nativeElement.value = ""; 
      }
    }
  
  _handleReaderLoaded(e:any) {
    let reader = e.target;
    this.angForm.get("tour_image")?.setValue(reader.result);
  }

  addevent() {
    if (this.angForm.status == "VALID") {
        this.clicked = true;
        let reqObj = {
            tourName: this.angForm.get('tourName')?.value.replaceAll("'","`").replaceAll('"','``'),
            location: this.angForm.get('location')?.value,
            description: this.angForm.get('description')?.value.replaceAll("'","`").replaceAll('"','``'),
            lat: this.angForm.get('lat')?.value,
            lng: this.angForm.get('lng')?.value,
            tour_image: this.angForm.get('tour_image')?.value,
        }
        const url = `${this.baseUrl}addMonumentTour`;
        this.add$ = this.ajaxService.post(reqObj, url).subscribe(
            (data) => {
                this.resData = data;
                this.snackBar.open(this.resData.msg, undefined, {
                    duration: 3000,
                    verticalPosition: "top",
                    panelClass: ["blue-snackbar"],
                });
                // Close dialog with true to indicate successful addition
                this.dialogRef.close(true);
            },
            (error) => {
                this.snackBar.open(error.error.msg || "Something went wrong, please try again.", undefined, {
                    duration: 4000,
                    verticalPosition: "top",
                    panelClass: ["red-snackbar"],
                });
                // Close dialog with false to indicate failure
                this.dialogRef.close(false);
            }
        );
    } else {
        var errormsg = "Please pass Valid Information.";
        this.snackBar.open(errormsg, undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
        });
    }
  }

  onSubmit() {
    if (this.angForm.valid) {
      this.isSubmitting = true;
      this.addevent();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [];
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFiles.push({
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
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
  @ViewChild('takeInput', {static: false}) InputVar!: ElementRef;
  clicked = false;
  resData: any;
  angForm!: FormGroup;
  public dataSource1: any;
  public Monumentdata: Monument[] = [];
  public tourdata: any;
  public disabledLocation: number | null = null;
  public spinner: Boolean = true;
  private readonly baseUrl = environment.baseUrl;
  getMonuments$!: Subscription;
  tour$!: Subscription;
  edit$!: Subscription;
  center: google.maps.LatLngLiteral = {
    lat: 51.5339834,
    lng: 0.0753218
  };
  zoom = 10;
  markers: Marker[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };
  selectedFiles: { preview: string }[] = [];
  existingImages: string[] = [];
  isSubmitting = false;

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
      location: this.fb.array([], [Validators.required]),
      tour_id: [this.data.data.id],
      description: [this.data.data.discription, [Validators.required]],
      lat: [this.data.data.lat, [Validators.required]],
      lng: [this.data.data.lng, [Validators.required]],
      tour_image: [this.data.data.tour_image, [Validators.required]],
      imageChanged: [false]
    });

    // Initialize with first control
    this.addMoreLocation();
  }

  get location() {
    return this.angForm.get('location') as FormArray;
  }

  addMoreLocation() {
    if (this.location.length < 2) {
      this.location.push(this.fb.control(null, Validators.required));
    }
  }

  RemoveLocation() {
    if (this.location.length > 1) {
      const removedValue = this.location.at(this.location.length - 1).value;
      this.location.removeAt(this.location.length - 1);
      
      // Re-enable the removed monument in the dropdown
      if (removedValue) {
        this.Monumentdata = this.Monumentdata.map(monument => ({
          ...monument,
          disable: monument.id === removedValue ? false : monument.disable
        }));
      }
    }
  }

  async getallMonuments() {
    const url = `${this.baseUrl}getMonuments`;
    this.getMonuments$ = this.ajaxService
      .get(url)
      .subscribe(async (data: any) => {
        this.Monumentdata = await data["response"];
        await this.tourDetail();
      });
  }

  remove_monument(data:any) {
    //Storing id in temp variable and when add more location then disable it on this addMoreLocation()
    this.disabledLocation = data;
  }

  tourDetail() {
    const url = `${this.baseUrl}tourDetail`;
    let data = { id: this.data.data.id };
    this.tour$ = this.ajaxService.post(data, url).subscribe((data: any) => {
      this.tourdata = data["response"];
      
      // Clear existing controls
      while (this.location.length) {
        this.location.removeAt(0);
      }

      // Add controls for each tour location
      if (this.tourdata && this.tourdata.length > 0) {
        this.tourdata.forEach((value: any) => {
          this.location.push(this.fb.control(value.monument_id, Validators.required));
          
          // Update monument disable state
          this.Monumentdata = this.Monumentdata.map(monument => ({
            ...monument,
            disable: monument.id === value.monument_id || 
                    this.location.value.includes(monument.id)
          }));
        });
      } else {
        // Add at least one empty control
        this.addMoreLocation();
      }
      
      this.spinner = false;
    });
  }

  handleInputChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.angForm.patchValue({
            tour_image: e.target.result,
            imageChanged: true  // Set imageChanged to true when new image is loaded
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.snackBar.open('Only Images are allowed (JPG | PNG | JPEG)', undefined, {
          duration: 2500,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.InputVar.nativeElement.value = "";
      }
    }
  }

  editevent() {
    if (this.angForm.valid) {  // Changed back to only check form validity
      this.clicked = true;
      const url = `${this.baseUrl}editMonumentTour`;
      
      const reqObj = {
        tourName: this.angForm.get('tourName')?.value.replaceAll("'","`").replaceAll('"','``'),
        location: this.angForm.get('location')?.value,
        description: this.angForm.get('description')?.value.replaceAll("'","`").replaceAll('"','``'),
        tour_id: this.angForm.get('tour_id')?.value,
        lat: this.angForm.get('lat')?.value,
        lng: this.angForm.get('lng')?.value,
        imageChanged: this.angForm.get('imageChanged')?.value,
        tour_image: this.angForm.get('tour_image')?.value,
        monument_id: this.angForm.get('monument_id')?.value
      };

      this.edit$ = this.ajaxService.post(reqObj, url).subscribe(
        (data) => {
          this.resData = data;
          this.snackBar.open(this.resData.msg, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBar.open(error.error.msg || "Something went wrong, please try again.", undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.dialogRef.close(false);
        }
      );
    } else {
      this.snackBar.open("Please provide valid information.", undefined, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }

  onSubmit() {
    if (this.angForm.valid) {
      this.isSubmitting = true;
      this.editevent();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [];
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFiles.push({
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
  }

  OpenImageViewerBox(imageUrl: string) {
    const dialogData = new ImageViewergModel("Image Viewer", '', imageUrl);
    this.dialog.open(ImageViewerComponent, {
      minWidth: "50%",
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: dialogData,
      disableClose: true,
    });
  }

  onMonumentSelect(monumentId: number, index: number) {
    // Find the selected monument
    const selectedMonument = this.Monumentdata.find(m => m.id === monumentId);
    if (selectedMonument) {
      // If this is the first monument, update the form coordinates
      if (index === 0) {
        this.angForm.patchValue({
          lat: selectedMonument.lat,
          lng: selectedMonument.lng
        });

        // Update map marker and center
        const lat = parseFloat(selectedMonument.lat);
        const lng = parseFloat(selectedMonument.lng);
        
        this.center = { lat, lng };
        this.markers = [{
          position: { lat, lng },
          options: {
            draggable: true,
            animation: google.maps.Animation.DROP
          }
        }];
      }

      // Mark the selected monument as disabled for other dropdowns
      this.Monumentdata = this.Monumentdata.map(monument => ({
        ...monument,
        disable: monument.id === monumentId || 
                this.location.value.includes(monument.id)
      }));
    }
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
  showDetails$!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService
  ) {
    this.showDetail();

    // Add click handler for escape key
    dialogRef.keydownEvents().subscribe(event => {
        if (event.key === "Escape") {
            this.dialogRef.close();
        }
    });

    // Add click handler for backdrop click
    dialogRef.backdropClick().subscribe(() => {
        this.dialogRef.close();
    });
  }

  showDetail() {
    const url = `${this.baseUrl}tourDetail`;
    let data = { id: this.data.id };
    this.showDetails$ = this.ajaxService.post(data, url).subscribe((data: any) => {
      this.tourData = data["response"];
      this.spinner = false;
    });
  }

  ngOnDestroy() {
    if (this.showDetails$) {
      this.showDetails$.unsubscribe();
    }
  }
}
