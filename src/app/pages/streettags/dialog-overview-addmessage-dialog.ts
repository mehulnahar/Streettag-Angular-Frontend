import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings } from '../../app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';

@Component({
  selector: 'dialog-overview-addmessage-dialog',
  templateUrl: 'dialog-overview-addmessage-dialog.html',
  styleUrls: ['dialog-overview-addmessage-dialog.scss']
})
export class DialogOverviewAddMessageDialogStreettags implements OnInit {
  public lat: number = 51.5339834;
  public lng: number = 0.0753218;
  public zoom: number = 7;
  public settings!: Settings;
  angForm!: FormGroup;
  private map!: L.Map;
  public marker?: L.Marker;
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

  public mapOptions = {
    layers: [this.baseMaps['Map']],
    zoom: 7,
    center: L.latLng(51.5339834, 0.0753218)
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
    
    // Add layer control with both base maps
    L.control.layers(this.baseMaps).addTo(this.map);
    
    // Add initial marker if coordinates exist
    this.addMarker();
  }

  onMapClick(e: L.LeafletMouseEvent) {
    this.lat = e.latlng.lat;
    this.lng = e.latlng.lng;
    this.addMarker();
  }

  addMarker() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([this.lat, this.lng], {
      draggable: true
    });
    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
    });
    this.marker.addTo(this.map);
  }

  setlocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        if (this.map) {
          this.map.setView([this.lat, this.lng], 15);
          this.addMarker();
        }
      });
    }
  }

  // ... rest of your existing methods ...
} 