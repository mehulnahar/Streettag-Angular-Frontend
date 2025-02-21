import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AjaxService } from "src/app/ajax.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { GoogleMap } from "@angular/google-maps";
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';

interface MarkerPosition {
  lat: number;
  lng: number;
}

@Component({
  selector: "app-heat-map",
  templateUrl: "./heat-map.component.html",
  styleUrls: ["./heat-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapComponent implements OnInit, OnDestroy {
  @ViewChild('map') map!: ElementRef;
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  angForm!: FormGroup;
  downloadButton: boolean = true;
  markers: MarkerPosition[] = [];
  displayedMarkers: MarkerPosition[] = [];
  spinner: boolean = false;
  private readonly baseUrl = environment.baseUrl;
  private subject = new Subject<void>();

  // Google Maps options
  center: google.maps.LatLngLiteral = {
    lat: 51.5339834,
    lng: 0.0753218
  };
  zoom = 11;
  options: google.maps.MapOptions = {
    maxZoom: 15,
    minZoom: 10,
    scrollwheel: true,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP
  };

  constructor(
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.subject.pipe(debounceTime(1200)).subscribe(() => {
      if (this.googleMap) {
        const bounds = this.googleMap.getBounds();
        if (bounds) {
          this.displayedMarkers = this.markers.filter((marker) =>
            bounds.contains({ lat: marker.lat, lng: marker.lng })
          );
          this.spinner = false;
          this.ref.detectChanges();
        }
      }
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      duration: ["", [Validators.required]],
    });
  }

  disableDownloadButton() {
    this.downloadButton = true;
  }

  async download() {
    try {
      const temp = this.angForm.value.duration;
      const element = this.map.nativeElement;
      
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          FileSaver.saveAs(blob, `heat-map(${temp}).png`);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading map:', error);
      this.snackBar.open("Failed to download map", undefined, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    }
  }

  onSubmit() {
    this.markers = [];
    if (this.angForm.status === "VALID") {
      this.spinner = true;
      this.ref.detectChanges();
      const url = `${this.baseUrl}getHeatMapData`;
      const data = {
        duration: this.angForm.value.duration,
      };

      this.ajaxService.post(data, url).subscribe({
        next: (response: any) => {
          if (response.response?.length > 0) {
            this.markers = response.response.map((e: any) => ({
              lat: +e.lat,
              lng: +e.lng
            }));
            
            if (this.googleMap) {
              const bounds = this.googleMap.getBounds();
              if (bounds) {
                this.displayedMarkers = this.markers.filter((marker) =>
                  bounds.contains({ lat: marker.lat, lng: marker.lng })
                );
              }
            }
            
            this.spinner = false;
            this.downloadButton = false;
            this.ref.detectChanges();
          } else {
            this.markers = [];
            this.spinner = false;
            this.downloadButton = true;
            this.ref.detectChanges();
            this.snackBar.open("No Data Found.", undefined, {
              duration: 2000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          }
        },
        error: () => {
          this.spinner = false;
          this.downloadButton = true;
          this.ref.detectChanges();
          this.snackBar.open("Failed to load!", undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      });
    }
  }

  updateMarkers() {
    this.spinner = true;
    this.subject.next();
  }

  zoomIn() {
    if (this.googleMap && this.zoom < (this.options.maxZoom || 15)) {
      this.zoom++;
      this.ref.detectChanges();
    }
  }

  zoomOut() {
    if (this.googleMap && this.zoom > (this.options.minZoom || 10)) {
      this.zoom--;
      this.ref.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subject.complete();
  }
}

