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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";
import { MapMarker } from '@angular/google-maps';

export interface SponsorData {
  id: number;
  sponsor_name: string;
  tag_image: string;
  tag_image2: string;
  diameter: number;
  lat: number;
  lng: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface FileEvent extends Event {
  dataTransfer?: DataTransfer;
  target: HTMLInputElement;
}

export interface ReaderEvent extends ProgressEvent<FileReader> {
  target: FileReader;
}

@Component({
  selector: "app-sponsor",
  templateUrl: "./sponsor.component.html",
  styleUrls: ["./sponsor.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class SponsorComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;
  public settings!: Settings;
  public sidenavOpen: boolean = true;
  public newMail!: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form!: FormGroup;
  public isLoading: boolean = false;

  public show_dialog: boolean = false;
  public button_name: any = "Show Login Form!";
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 15;
  public displayedColumns = [
    "serialNumber",
    "sponsor_name",
    "sponsor_image",
    "sponsor_image2",
    "diameter",
    "edit"
  ];
  public dataSource: MatTableDataSource<SponsorData> = new MatTableDataSource<SponsorData>([]);

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getallSponsor();
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

  ////////////////open edit dialoge/////////////////////////
  openEditDialog(event: any): void {
    let dialogRef = this.dialog.open(DialogEditSponsor, {
      width: '800px',
      data: { event }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getallSponsor();
      }
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddSponsor, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getallSponsor();
      }
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallSponsor() {
    this.isLoading = true;
    const url = `${this.baseUrl}getSponsors`;
    
    this.ajaxService.get(url).subscribe({
      next: (data: any) => {
        if (data && data.response) {
          this.dataSource.data = data.response;
        } else {
          this.snackBar.open("No sponsors found", undefined, {
            duration: 2000,
            verticalPosition: "top",
          });
        }
      },
      error: (error) => {
        console.error('Error fetching sponsors:', error);
        this.snackBar.open("Error loading sponsors. Please try again.", undefined, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete ${data.sponsor_name} sponsor?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteSponsor(data.id);
      }
    });
  }

  deleteSponsor(id: number) {
    const url = `${this.baseUrl}deleteSponsor`;
    const data = { sponsor_id: id };

    this.ajaxService.post(data, url).subscribe({
      next: (response: any) => {
        this.getallSponsor();
        this.snackBar.open("Sponsor deleted successfully!", undefined, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      error: (error) => {
        this.snackBar.open("Error deleting sponsor. Please try again.", undefined, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    });
  }
}

@Component({
  templateUrl: "sponsor_add_modal.component.html",
  styles: [`
    .sponsor-form {
      padding: 20px;
    }
    .image-upload-section {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .upload-field {
      flex: 1;
    }
    .preview-image {
      max-width: 100%;
      max-height: 200px;
      margin-top: 10px;
    }
    .map-container {
      margin: 20px 0;
      height: 400px;
    }
    .coordinates-display {
      display: flex;
      gap: 20px;
    }
  `]
})
export class DialogAddSponsor implements OnInit {
  angForm: FormGroup;
  tag_image: any;
  tag_image2: any;
  tagDiameter: string = "500";
  allLocations: any[] = [];
  lat: number = 22.69310334966885;
  lng: number = 75.8820695508789;
  Number = Number;
  sponsorId: number = 0;
  
  // Google Maps properties
  center: google.maps.LatLngLiteral = { lat: 22.69310334966885, lng: 75.8820695508789 };
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral = this.center;
  
  markerOptions: google.maps.MarkerOptions = {
    draggable: true
  };
  
  circleOptions: google.maps.CircleOptions = {
    fillColor: '#00FF00',
    fillOpacity: 0.3,
    strokeColor: '#00FF00',
    strokeOpacity: 0.8,
    strokeWeight: 2
  };

  existingCircleOptions: google.maps.CircleOptions = {
    fillColor: '#FF0000',
    fillOpacity: 0.3,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2
  };

  constructor(
    private fb: FormBuilder,
    protected ajaxService: AjaxService,
    public dialogRef: MatDialogRef<DialogAddSponsor>,
    protected snackBar: MatSnackBar
  ) {
    this.angForm = this.fb.group({
      sponsor_name: ["", Validators.required],
      lat: ["", Validators.required],
      lng: ["", Validators.required],
      diameter: ["500", Validators.required]
    });
  }

  ngOnInit() {
    this.getAllLocations();
  }

  getAllLocations() {
    const url = `${environment.baseUrl}getSponsors`;
    this.ajaxService.get(url).subscribe((data: any) => {
      if (data && data.response) {
        this.allLocations = data.response;
      }
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.markerPosition = position;
      this.center = position;
      this.angForm.patchValue({
        lat: position.lat,
        lng: position.lng
      });
    }
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.markerPosition = position;
      this.center = position;
      this.angForm.patchValue({
        lat: position.lat,
        lng: position.lng
      });
    }
  }

  handleInputChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tag_image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  handleInputChange2(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tag_image2 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addevent() {
    if (this.angForm.valid && this.tag_image && this.tag_image2) {
      const formData = {
        ...this.angForm.value,
        tag_image: this.tag_image,
        tag_image2: this.tag_image2
      };

      const url = `${environment.baseUrl}addSponsors`;
      this.ajaxService.post(formData, url).subscribe({
        next: (response: any) => {
          this.snackBar.open("Sponsor added successfully!", undefined, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["green-snackbar"],
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open("Error adding sponsor. Please try again.", undefined, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      });
    } else {
      this.snackBar.open("Please fill all required fields and upload both images.", undefined, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    }
  }

  setlocation(address: string) {
    if (!address) {
      this.snackBar.open("Please enter a location", undefined, {
        duration: 2000,
        verticalPosition: "top",
      });
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const position = {
          lat: location.lat(),
          lng: location.lng()
        };
        
        this.markerPosition = position;
        this.center = position;
        this.angForm.patchValue({
          lat: position.lat,
          lng: position.lng
        });
      } else {
        this.snackBar.open("Location not found. Please try again.", undefined, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    });
  }
}

@Component({
  templateUrl: "sponsor_edit_modal.component.html",
  styles: [`
    .sponsor-form {
      padding: 20px;
    }
    .image-upload-section {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .upload-field {
      flex: 1;
    }
    .preview-image {
      max-width: 100%;
      max-height: 200px;
      margin-top: 10px;
    }
    .map-container {
      margin: 20px 0;
      height: 400px;
    }
    .coordinates-display {
      display: flex;
      gap: 20px;
    }
  `]
})
export class DialogEditSponsor extends DialogAddSponsor {
  override sponsorId: number;

  constructor(
    fb: FormBuilder,
    protected override ajaxService: AjaxService,
    dialogRef: MatDialogRef<DialogEditSponsor>,
    protected override snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(fb, ajaxService, dialogRef, snackBar);
    this.sponsorId = data.event.id;
    
    // Set initial values
    this.tag_image = data.event.tag_image;
    this.tag_image2 = data.event.tag_image2;
    this.center = { lat: data.event.lat, lng: data.event.lng };
    this.markerPosition = this.center;
    this.tagDiameter = data.event.diameter.toString();
    
    this.angForm.patchValue({
      sponsor_name: data.event.sponsor_name,
      lat: data.event.lat,
      lng: data.event.lng,
      diameter: data.event.diameter
    });

    // Subscribe to form value changes
    this.angForm.get('diameter')?.valueChanges.subscribe(value => {
      this.tagDiameter = value.toString();
    });

    this.angForm.get('lat')?.valueChanges.subscribe(value => {
      this.lat = value;
      this.center = { ...this.center, lat: value };
      this.markerPosition = { ...this.markerPosition, lat: value };
    });

    this.angForm.get('lng')?.valueChanges.subscribe(value => {
      this.lng = value;
      this.center = { ...this.center, lng: value };
      this.markerPosition = { ...this.markerPosition, lng: value };
    });
  }

  override addevent() {
    if (this.angForm.valid) {
      const formData = {
        ...this.angForm.value,
        tag_image: this.tag_image,
        tag_image2: this.tag_image2,
        id: this.sponsorId
      };

      const url = `${environment.baseUrl}editSponsors`;
      this.ajaxService.post(formData, url).subscribe({
        next: (response: any) => {
          this.snackBar.open("Sponsor updated successfully!", undefined, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["green-snackbar"],
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open("Error updating sponsor. Please try again.", undefined, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      });
    }
  }
}

