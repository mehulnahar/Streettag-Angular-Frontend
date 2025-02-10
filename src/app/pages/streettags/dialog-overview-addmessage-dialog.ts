import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings } from '../../app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';

declare global {
  interface Window {
    google: typeof google;
  }
}

@Component({
  selector: 'dialog-overview-addmessage-dialog',
  templateUrl: 'dialog-overview-addmessage-dialog.html',
  styleUrls: ['dialog-overview-addmessage-dialog.scss']
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

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get<any>(url).subscribe((data) => {
      this.dataSourceLocation = data.response;
    });
  }

  getallBuilding() {
    var url = `${this.baseUrl}getBuildings`;
    this.ajaxService.get<any>(url).subscribe((data) => {
      this.dataSourceBuilding = data.response;
    });
  }

  async setlocation() {
    const location = this.angForm.get('location')?.value;
    if (!location) {
      this.snackBar.open('Please enter a location first', 'Close', {
        duration: 3000,
      });
      return;
    }

    try {
      // Use Nominatim geocoding service
      const response = await this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`).toPromise();
      const results = response as any[];

      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        
        // Update form values
        this.lat = parseFloat(lat);
        this.lng = parseFloat(lon);
        this.angForm.patchValue({
          lat: this.lat,
          lng: this.lng
        });

        // Update map zoom
        this.zoom = 15;
        
        this.snackBar.open('Location set successfully', 'Close', {
          duration: 3000,
        });
      } else {
        this.snackBar.open('Location not found. Please try a different search.', 'Close', {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      this.snackBar.open('Error setting location. Please try again.', 'Close', {
        duration: 3000,
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
    this.ajaxService.post<any>(data, url).subscribe((data) => {
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

      this.ajaxService.post<any>(data, url).subscribe((response) => {
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