import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Settings } from 'src/app/app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { AppSettings } from 'src/app/app.settings';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

export interface RfBoxData {
  id: number;
  device_id: string;
  device_name: string;
  score: number;
  lat: string;
  lng: string;
  serial_number?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-rf-box',
  templateUrl: './rf-box.component.html',
  styleUrls: ['./rf-box.component.scss'],
})
export class RfBoxComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public newMail: boolean = false;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string = '';
  public form: FormGroup;

  public show_dialog: boolean = false;
  public button_name: any = 'Show Login Form!';
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = '';
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    'serial_number',
    'device_id',
    'device_name',
    'score',
    'lat',
    'lng',
    'actions',
  ];
  public dataSource: MatTableDataSource<RfBoxData>;
  public dataSourceLocation: any;
  public selectedValue: string = '';
  public picker1: Date | null = null;
  public picker2: Date | null = null;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({
      to: ['', Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
    this.dataSource = new MatTableDataSource<RfBoxData>([]);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallCircuits();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
    }
  }

  openEditDialog(data: RfBoxData): void {
    const dialogRef = this.dialog.open(RfBoxAddDialog, {
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getallCircuits();
      }
    });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(RfBoxAddDialog, {
      width: '700px',
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getallCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallCircuits() {
    const url = `${this.baseUrl}getRFDeviceData`;
    this.ajaxService.get(url).subscribe((response: any) => {
      if (response && response.data) {
        this.dataSource = new MatTableDataSource<RfBoxData>(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  confirmDialog(data: RfBoxData) {
    const message = `Are you sure you want to delete device ${data.device_name} ?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult === true) {
        const url = `${this.baseUrl}deleteRFDeviceData`;
        const dataobj = { id: data.id };

        this.ajaxService.post(dataobj, url).subscribe(
          (data) => {
            this.resData = data;
            this.getallCircuits();
            this.snackBar.open('RF Device deleted Successfully!', undefined, {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          (error) => {
            this.snackBar.open(error.message, undefined, {
              duration: 3000,
              verticalPosition: 'top',
            });
          }
        );
      }
    });
  }

  public navigateToDeviceTime(element: RfBoxData) {
    this.router.navigate(['/admin/rf-device-time'], {
      queryParams: { 
        deviceId: element.device_id,
        deviceName: element.device_name
      }
    });
  }
}

@Component({
  selector: 'add-rf-box',
  templateUrl: 'add-rf-box.html',
})
export class RfBoxAddDialog {
  public lat: number = 51.5339834;
  public lng: number = 0.0753218;
  location = '';
  angForm: FormGroup;
  id: number = 0;
  edit: boolean = false;
  private readonly baseUrl = environment.baseUrl;
  resData: any;

  mapOptions: google.maps.MapOptions = {
    scrollwheel: false,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };

  constructor(
    public dialogRef: MatDialogRef<RfBoxAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: RfBoxData,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
  ) {
    this.angForm = this.formBuilder.group({
      device_id: ['', Validators.required],
      device_name: ['', Validators.required],
      score: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
    });

    if (data && data.id) {
      this.edit = true;
      this.id = data.id;
      this.lat = parseFloat(data.lat);
      this.lng = parseFloat(data.lng);
      this.angForm.setValue({
        device_id: data.device_id || null,
        device_name: data.device_name || null,
        score: data.score || null,
        lat: data.lat || null,
        lng: data.lng || null,
      });
    }
  }

  get fc() {
    return this.angForm.controls;
  }

  getErrorMessage(field: string, displayname: string): string {
    if (this.angForm.controls[field].hasError('required')) {
      return displayname + ' is required';
    }
    if (this.angForm.controls[field].hasError('pattern')) {
      if (this.angForm.controls[field].errors?.['pattern']?.requiredPattern === '^[0-9]*$') {
        return displayname + ' should be numeric';
      }
    }
    return '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formsubmit() {
    if (this.edit) {
      if (this.angForm.valid) {
        const url = `${this.baseUrl}updateRFDeviceData`;
        const data = this.angForm.value;
        data.id = this.id;

        this.ajaxService.post(data, url).subscribe((response: any) => {
          this.resData = response;
          let dynamicSnackColor = 'blue-snackbar';
          if (this.resData.status === 'false') {
            dynamicSnackColor = 'red-snackbar';
          }
          this.snackBar.open(this.resData.msg, undefined, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        });
      }
    } else {
      if (this.angForm.valid) {
        const url = `${this.baseUrl}insertRFDeviceData`;
        this.ajaxService.post(this.angForm.value, url).subscribe((response: any) => {
          this.resData = response;
          let dynamicSnackColor = 'blue-snackbar';
          if (this.resData.status === 'false') {
            dynamicSnackColor = 'red-snackbar';
          }
          this.snackBar.open(this.resData.msg, undefined, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        });
      }
    }
  }

  setlocation() {
    if (!this.location) {
      this.snackBar.open('Please enter a location', 'Close', {
        duration: 3000
      });
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        this.lat = location.lat();
        this.lng = location.lng();
        
        // Update form values
        this.angForm.patchValue({
          lat: this.lat,
          lng: this.lng
        });

        this.snackBar.open('Location set successfully', 'Close', {
          duration: 3000
        });
      } else {
        this.snackBar.open('Location not found', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.lat = event.latLng.lat();
      this.lng = event.latLng.lng();
    }
  }

  markerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.lat = event.latLng.lat();
      this.lng = event.latLng.lng();
    }
  }
}

