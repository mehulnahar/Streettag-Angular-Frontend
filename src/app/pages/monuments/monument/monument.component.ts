import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
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
import { MatSort } from "@angular/material/sort";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subscription, Observable, of } from "rxjs";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";
import { pluck } from "rxjs/operators";
import { ImageViewergModel } from "src/app/shared/image-viewer/image-viewer.model";
import { ImageViewerComponent } from "src/app/shared/image-viewer/image-viewer.component";
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { map } from 'rxjs/operators';
import { GoogleMap } from '@angular/google-maps';

interface Monument {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  link?: string;
  basketFlag: boolean;
  address: string;
  images?: string[];
  videos?: string[];
  audio?: string[];
  video?: string;  // For backward compatibility
  image?: string;  // For backward compatibility
}

@Component({
  selector: "app-monument",
  templateUrl: "./monument.component.html",
  styleUrls: ["./monument.component.scss"],
})
export class MonumentComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form!: FormGroup;
  public Monument$!: Subscription;

  resData: any;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns = [
    "serial_number",
    "name",
    "description",
    "lat",
    "lng",
    "link",
    "basketFlag",
    "edit"
  ];
  public dataSource: any;
  delete$!: Subscription;
  monuments$: Observable<Monument[]>;

  constructor(
    private ajaxService: AjaxService,
    private dialog: MatDialog,
    private appSettings: AppSettings,
    public snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.settings = this.appSettings.settings;
    this.monuments$ = this.getMonuments();
    this.Monument$ = this.monuments$.subscribe(
      monuments => {
        this.dataSource = new MatTableDataSource(monuments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getMonuments(): Observable<Monument[]> {
    return this.http.get<{response: Monument[]}>(
      `${environment.baseUrl}getMonuments`
    ).pipe(
      map(response => response.response)
    );
  }

  addMonument(): void {
    let dialogRef = this.dialog.open(AddMonumentDialog, {
      minWidth: "75%",
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.monuments$ = this.getMonuments();
      }
    });
  }

  editMonument(data: Monument): void {
    let dialogRef = this.dialog.open(EditMonumentDialog, {
      data: { data },
      minWidth: "75%",
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.monuments$ = this.getMonuments();
      }
    });
  }

  deleteMonument(id: number): void {
    const message = `Are you sure you want to delete this monument?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        const url = `${this.baseUrl}deleteMonument`;
        this.delete$ = this.ajaxService.post({ id }, url).subscribe(
          () => {
            this.snackBar.open("Monument has been deleted successfully.", undefined, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: ["blue-snackbar"]
            });
            this.dataSource.data = this.dataSource.data.filter((item: Monument) => item.id !== id);
          },
          (error) => {
            this.snackBar.open(error.error.msg || "Something went wrong", undefined, {
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
    if (this.Monument$) {
      this.Monument$.unsubscribe();
    }
    if (this.delete$) {
      this.delete$.unsubscribe();
    }
  }
}

@Component({
  selector: "add-monument",
  templateUrl: "./addmessage-dialog.html",
  styleUrls: ["./monument.component.scss"],
})
export class AddMonumentDialog implements OnInit, OnDestroy {
  @ViewChild("fileInput", { static: true }) fileInput!: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('googleMap') googleMap!: GoogleMap;

  clicked = false;
  resData: any;
  angForm!: FormGroup;
  default_lat = 51.5339834;
  default_lng = 0.0753218;
  
  // Google Maps properties
  center: google.maps.LatLngLiteral = {
    lat: this.default_lat,
    lng: this.default_lng
  };
  markerPosition: google.maps.LatLngLiteral | null = null;
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
    animation: google.maps.Animation.BOUNCE
  };
  zoom = 10;

  SetLocation$?: Subscription;
  add$?: Subscription;
  public location = '';
  public multipleImages: FileList | null = null;
  public multipleVideos: FileList | null = null;
  public multipleAudio: FileList | null = null;
  public dataSource1: any;
  public progrees = 0;
  public SelectedVideoCount = 0;
  public SelectedAudioCount = 0;
  public SelectedImgCount = 0;
  public showBar = false;
  private readonly baseUrl = environment.baseUrl;
  private readonly userUrl = environment.userUrl;
  private geoCoder: google.maps.Geocoder;
  nearByLatLng: Observable<any> = of([]);
  resData1: any;
  delete$?: Subscription;
  private nearbyMarkers: google.maps.Marker[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMonumentDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private _http: HttpClient,
    private dialog: MatDialog,
  ) {
    this.createForm();
    this.geoCoder = new google.maps.Geocoder();
  }

  ngOnInit() {
    this.angForm.get('basketFlag')?.valueChanges
      .subscribe(checkedValue => {
        const link = this.angForm.get('link');
        const reg = "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
        
        if (checkedValue === '0') {
          link?.clearValidators();
        } else {
          link?.setValidators([Validators.required, Validators.pattern(reg)]);
        }
        link?.updateValueAndValidity();
      });
  }

  createForm() {
    this.angForm = this.fb.group({
      name: ['', [Validators.required]],
      description: this.fb.array([this.fb.control('')]),
      link: [''],
      basketFlag: ['0', [Validators.required]],
      address: ['']
    });
  }

  get description() {
    return this.angForm.get('description') as FormArray;
  }

  get getAddress() {
    return this.angForm.get('address')?.value;
  }

  set address(val: string) {
    this.angForm.get('address')?.setValue(val);
  }

  addMoreDecription() {
    this.description.push(this.fb.control(""));
  }

  RemoveDecription() {
    if (this.description.length > 1) {
      this.description.removeAt(this.description.length - 1);
    }
  }

  markerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markerPosition = { lat, lng };
      this.center = { lat, lng };
      this.findAddressByCoordinates(lat, lng);
      
      setTimeout(() => {
        this.getNearByTags();
      }, 100);
    }
  }

  findAddressByCoordinates(latitude: number, longitude: number) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          this.address = results[0].formatted_address;
        }
      }
    );
  }

  setlocation() {
    if (this.location) {
      this.geoCoder.geocode(
        { address: this.location },
        (results, status) => {
          if (status === 'OK' && results && results[0] && results[0].geometry && results[0].geometry.location) {
            const latitude = results[0].geometry.location.lat();
            const longitude = results[0].geometry.location.lng();
            this.markerPosition = { lat: latitude, lng: longitude };
            this.center = this.markerPosition;
            this.zoom = 15;
            this.address = results[0].formatted_address;
            this.getNearByTags();
          }
        }
      );
    }
  }

  openInfoWindow(marker: MapMarker, content: string) {
    this.infoWindow.open(marker);
  }

  closeInfoWindow() {
    this.infoWindow.close();
  }

  confirmDialog(id: number): void {
    const message = `Are you sure you want to Delete this Tag?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        const url = `${this.userUrl}strtg/deleteAutoTags`;
        const data1 = {
          qid: id
        };
        this.delete$ = this.ajaxService.post(data1, url).subscribe((data) => {
          this.resData1 = data;
          let dynamicSnackColor = "blue-snackbar";
          if (this.resData1.status === "false") {
            dynamicSnackColor = "red-snackbar";
            this.snackBar.open(this.resData1.msg, undefined, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: dynamicSnackColor,
            });
          } else {
            this.getNearByTags();
          }
        });
      }
    });
  }

  getNearByTags() {
    // Clear existing markers first
    this.clearNearbyMarkers();
    
    const url = `${this.baseUrl}getNearByTags`;
    const data1 = {
      diameter: "1000",
      lat: this.markerPosition?.lat || 0,
      lng: this.markerPosition?.lng || 0,
    };
    this.nearByLatLng = this.ajaxService.post(data1, url).pipe(
      pluck("response"),
      map(response => {
        // Add markers for nearby tags
        if (Array.isArray(response)) {
          response.forEach(tag => {
            const marker = new google.maps.Marker({
              position: { lat: parseFloat(tag.lat), lng: parseFloat(tag.lng) },
              map: this.googleMap?.googleMap,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(32, 32)
              },
              title: tag.name
            });
            this.nearbyMarkers.push(marker);
          });
        }
        return response;
      })
    );
  }

  private clearNearbyMarkers() {
    this.nearbyMarkers.forEach(marker => marker.setMap(null));
    this.nearbyMarkers = [];
  }

  addevent() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const fd = new FormData();

      // Basic fields
      fd.append("name", this.angForm.get("name")?.value || '');
      fd.append("description", JSON.stringify(this.angForm.get("description")?.value.filter((desc: string) => desc.trim() !== '')));
      
      // Coordinates and address
      if (this.markerPosition) {
        fd.append("lat", this.markerPosition.lat.toString());
        fd.append("lng", this.markerPosition.lng.toString());
      }
      fd.append("address", this.getAddress || '');
      
      // Link and basket flag
      fd.append("link", this.angForm.get("link")?.value || '');
      fd.append("basketFlag", this.angForm.get("basketFlag")?.value || '0');

      // Media files
      if (this.multipleVideos?.length) {
        fd.append("videos", this.multipleVideos[0]);
      }

      if (this.multipleAudio?.length) {
        fd.append("audio", this.multipleAudio[0]);
      }

      if (this.multipleImages?.length) {
        fd.append("img", this.multipleImages[0]);
      }

      const url = `${this.baseUrl}addMonument`;
      this.add$ = this.ajaxService.post(fd, url).subscribe(
        (response: any) => {
          this.resData = response;
          this.snackBar.open(this.resData?.msg || "Monument added successfully", undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.dialogRef.close(true);
        },
        (error) => {
          this.clicked = false;
          this.snackBar.open(error.error?.msg || "Error adding monument", undefined, {
            duration: 4000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    } else {
      this.snackBar.open("Please fill all required fields correctly", undefined, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        if (input.files[i].type !== 'video/mp4') {
          this.SelectedVideoCount = 0;
          this.snackBar.open('Only Videos are allowed (MP4)', undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
          return;
        }
      }
      this.SelectedVideoCount = input.files.length;
      this.multipleVideos = input.files;
    }
  }

  onFileChange1(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        if (input.files[i].type !== 'audio/mpeg') {
          this.snackBar.open('Only Audios are allowed (MP3)', undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
          this.SelectedAudioCount = 0;
          return;
        }
      }
      this.SelectedAudioCount = input.files.length;
      this.multipleAudio = input.files;
    }
  }

  onFileChangeImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const type = input.files[i].type;
        if (type !== 'image/jpg' && type !== 'image/jpeg' && type !== 'image/png') {
          this.snackBar.open('Only Images are allowed (JPG | PNG | JPEG)', undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
          this.SelectedImgCount = 0;
          return;
        }
      }
      this.SelectedImgCount = input.files.length;
      this.multipleImages = input.files;
    }
  }

  ngOnDestroy() {
    if (this.add$) this.add$.unsubscribe();
    if (this.SetLocation$) this.SetLocation$.unsubscribe();
    if (this.delete$) this.delete$.unsubscribe();
    this.clearNearbyMarkers();
  }
}

@Component({
  selector: "edit-monument",
  templateUrl: "./editmessage-dialog.html",
  styleUrls: ["./monument.component.scss"],
})
export class EditMonumentDialog implements OnInit, OnDestroy {
  @ViewChild("fileInput", { static: true }) fileInput!: ElementRef;
  clicked = false;
  resData: any;
  angForm!: FormGroup;
  public videoUrl: string[] = [];
  public audioUrl: string[] = [];
  public imageUrl: string[] = [];
  private readonly baseUrl = environment.baseUrl;
  public multipleImages: FileList | null = null;
  public multipleVideos: FileList | null = null;
  public multipleAudio: FileList | null = null;
  public progrees = 0;
  public showBar = false;
  public SelectedVideoCount = 0;
  public SelectedAudioCount = 0;
  public SelectedImgCount = 0;
  edit$?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditMonumentDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { data: Monument },
    public snackBar: MatSnackBar,
    private _http: HttpClient,
    private dialog: MatDialog,
  ) {
    this.createForm();
    try {
      this.videoUrl = Array.isArray(this.data.data.videos) ? this.data.data.videos :
                      (this.data.data.video ? JSON.parse(this.data.data.video) : []);
      this.audioUrl = Array.isArray(this.data.data.audio) ? this.data.data.audio :
                      JSON.parse(this.data.data.audio || '[]');
      this.imageUrl = Array.isArray(this.data.data.images) ? this.data.data.images :
                      (this.data.data.image ? JSON.parse(this.data.data.image) : []);
    } catch (e) {
      console.error('Error parsing media URLs:', e);
      this.videoUrl = [];
      this.audioUrl = [];
      this.imageUrl = [];
    }
  }

  ngOnInit() {
    this.angForm.get('basketFlag')?.valueChanges
      .subscribe(checkedValue => {
        const link = this.angForm.get('link');
        const reg = "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
        
        if (checkedValue === '0') {
          link?.clearValidators();
        } else {
          link?.setValidators([Validators.required, Validators.pattern(reg)]);
        }
        link?.updateValueAndValidity();
      });
  }

  createForm() {
    this.angForm = this.fb.group({
      name: [this.data.data.name, [Validators.required]],
      description: this.fb.array(JSON.parse(this.data.data.description || '[]')),
      link: [this.data.data.link],
      basketFlag: [String(this.data.data.basketFlag ? 1 : 0)]
    });
  }

  get description() {
    return this.angForm.get('description') as FormArray;
  }

  addMoreDecription() {
    this.description.push(this.fb.control(''));
  }

  RemoveDecription() {
    if (this.description.length > 1) {
      this.description.removeAt(this.description.length - 1);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        if (input.files[i].type !== 'video/mp4') {
          this.SelectedVideoCount = 0;
          this.snackBar.open('Only Videos are allowed (MP4)', undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
          return;
        }
      }
      this.SelectedVideoCount = input.files.length;
      this.multipleVideos = input.files;
    }
  }

  onFileChange1(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        if (input.files[i].type !== 'audio/mpeg') {
          this.snackBar.open('Only Audios are allowed (MP3)', undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
          this.SelectedAudioCount = 0;
          return;
        }
      }
      this.SelectedAudioCount = input.files.length;
      this.multipleAudio = input.files;
    }
  }

  onFileChangeImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const type = input.files[i].type;
        if (type !== 'image/jpg' && type !== 'image/jpeg' && type !== 'image/png') {
          this.snackBar.open('Only Images are allowed (JPG | PNG | JPEG)', undefined, {
            duration: 2500,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
          this.SelectedImgCount = 0;
          return;
        }
      }
      this.SelectedImgCount = input.files.length;
      this.multipleImages = input.files;
    }
  }

  OpenImageViewerBox(image: string) {
    const dialogData = new ImageViewergModel("Image Viewer", '', image);
    this.dialog.open(ImageViewerComponent, {
      minWidth: "50%",
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: dialogData,
      disableClose: true
    });
  }

  editevent() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}editMonument`;
      const fd = new FormData();

      // Basic fields with exact values
      fd.append("name", (this.angForm.get("name")?.value || '').toString().trim());
      fd.append("description", JSON.stringify(this.angForm.get("description")?.value.filter((desc: string) => desc.trim() !== '')));
      fd.append("id", this.data.data.id.toString());
      
      // Handle link - ensure it's a string and trimmed
      const link = (this.angForm.get("link")?.value || '').toString().trim();
      if (link) {
        fd.append("link", link);
      }

      // Handle basketFlag - ensure it's "0" or "1"
      fd.append("basketFlag", this.angForm.get("basketFlag")?.value === 1 ? "1" : "0");

      // Handle media files one at a time
      if (this.multipleImages?.length) {
        fd.append("img", this.multipleImages[0]);
      }

      if (this.multipleAudio?.length) {
        fd.append("audio", this.multipleAudio[0]);
      }

      if (this.multipleVideos?.length) {
        fd.append("videos", this.multipleVideos[0]);
      }

      this.edit$ = this._http
        .post(url, fd, {
          reportProgress: true,
          observe: "events"
        })
        .subscribe(
          (data) => {
            if (data.type === HttpEventType.UploadProgress && data.total) {
              this.showBar = true;
              this.progrees = Math.round((data.loaded / data.total) * 100);
            } else if (data.type === HttpEventType.Response) {
              this.resData = data;
              this.snackBar.open("Monument Updated Successfully", undefined, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: ["blue-snackbar"]
              });
              this.dialogRef.close(true);
            }
          },
          (error) => {
            this.clicked = false;
            this.snackBar.open(error.error?.msg || "Error updating monument", undefined, {
              duration: 2500,
              verticalPosition: "top",
              panelClass: ["red-snackbar"]
            });
          }
        );
    } else {
      this.snackBar.open("Please fill all required fields correctly", undefined, {
        duration: 2500,
        verticalPosition: "top",
        panelClass: "red-snackbar"
      });
    }
  }
  ngOnDestroy(): void {
    if (this.edit$) this.edit$.unsubscribe();
  }
}

