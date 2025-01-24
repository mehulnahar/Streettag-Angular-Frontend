import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AjaxService } from "src/app/ajax.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import html2canvas from "html2canvas/dist/html2canvas.min";
import * as FileSaver from "file-saver/dist/FileSaver.min";
import {LatLngBounds, LatLngLiteral } from "@agm/core/map-types";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs/internal/Subject";
import { debounceTime } from "rxjs/operators/debounceTime";

@Component({
  selector: "app-heat-map",
  templateUrl: "./heat-map.component.html",
  styleUrls: ["./heat-map.component.scss"],
   changeDetection : ChangeDetectionStrategy.OnPush
})
export class HeatMapComponent implements OnInit{
  
  public angForm: any;
  public downloadButton: Boolean = true;
  public markers = [];
  displayedMarkers : LatLngLiteral[];
  public spinner: Boolean = false;
  private readonly baseUrl = environment.baseUrl;
  @ViewChild("map", { static: true }) map: ElementRef;
  private subject: Subject<any> = new Subject();
  private FirstLoadBounds: LatLngBounds;
  worker:Worker;
  constructor(
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    private ref :ChangeDetectorRef
  ) {this.createForm();}

  ngOnInit() {
    this.subject.pipe(debounceTime(1200)).subscribe((newBounds) => {
    this.FirstLoadBounds = newBounds;
      this.displayedMarkers = this.markers.filter((marker: any) =>
         newBounds.contains(marker)
      );
      this.spinner = false;
       this.ref.detectChanges();
     });
  }

  disableDownloadButton() {
    this.downloadButton = true;
  }

  createForm() {
    this.angForm = this.fb.group({
      duration: ["", [Validators.required]],
    });
  }

  download() {
    let temp = this.angForm.value.duration;
    html2canvas(this.map.nativeElement, {
      backgroundColor: null,
      useCORS: true,
    }).then((canvas:any) => {
      canvas.toBlob(function (blob: any) {
        FileSaver.saveAs(blob, `heat-map(${temp}).png`);
      }, "image/png");
    });
  }
  
  onSubmit() {
    this.markers = [];
    if (this.angForm.status == "VALID") {
      this.spinner = true;
      const url = `${this.baseUrl}getHeatMapData`;
      var data1 = {
        duration: this.angForm.value.duration,
      };
     this.ajaxService.post(data1, url).subscribe(
         (data) => {
          if (data["response"].length > 0) {
     
            //Using Web Worker
            if (typeof Worker !== 'undefined') {
              if(this.worker)this.worker.terminate();
              this.worker = new Worker('./heat-map.worker', { type: 'module' });
              this.worker.onmessage = ({ data }) => {
                this.markers = data;
             };
             this.worker.postMessage(data["response"]);
            }else{
            data["response"].forEach((e: { lat: string | number; lng: string | number; }) => {
              this.markers.push({ lat: +e.lat, lng: +e.lng });
            });
          }
            
          this.updateMarkers(this.FirstLoadBounds);
          
           this.spinner = false;
            this.downloadButton = false;
          } else {
            this.markers = [];
            this.spinner = false;
            this.snackBar.open("No Data Found.", null, {
              duration: 2000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
            this.downloadButton = true;
          }
        },
        (error) => {
          this.spinner = false;
          this.downloadButton = true;
          this.snackBar.open("Failed to load!", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    }
    this.ref.markForCheck();
  }

  updateMarkers(newBounds : any) {
    this.spinner = true;
    this.subject.next(newBounds);
  }

  ngOnDestroy(){
    this.subject.unsubscribe();
    if(this.worker)this.worker.terminate();
  }

}

