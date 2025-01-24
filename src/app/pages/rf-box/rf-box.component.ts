import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  DateAdapter,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { Router } from '@angular/router';
import { Settings } from 'src/app/app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { AppSettings } from 'src/app/app.settings';
import { environment } from 'src/environments/environment';
import {
  DialogOverviewMessageDialogCircuit,
  DialogOverviewAddMessageDialogCircuit,
} from '../circuit/circuit.component';
import * as moment from 'moment';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-rf-box',
  templateUrl: './rf-box.component.html',
  styleUrls: ['./rf-box.component.scss'],
})
export class RfBoxComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;

  public newMail: boolean;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string;
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
  public dataSource: any;
  public dataSourceLocation: any;
  public selectedValue: string;
  public picker1;
  public picker2;
  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallCircuits();

    this.form = this.formBuilder.group({
      to: ['', Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
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

  openEditDialog(data): void {
    let dialogRef = this.dialog.open(RfBoxAddDialog, {
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(RfBoxAddDialog, {
      width: '700px',
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFDeviceData`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data['data']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  confirmDialog(data) {
    const message = `Are you sure you want to delete device ${data.device_name} ?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        var url = `${this.baseUrl}deleteRFDeviceData`;
    var dataobj = { id: data.id };

    this.ajaxService.post(dataobj, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        this.snackBar.open('RF Device deleted Successfully!', null, {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        this.snackBar.open(error.message, null, {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
      }
    });


    
  }
}

@Component({
  selector: 'add-rf-box',
  templateUrl: 'add-rf-box.html',
})
export class RfBoxAddDialog {
  public lat: any = 51.5339834;
  public lng: any = 0.0753218;
  location = '';
  angForm: FormGroup;
  id: number;
  edit: boolean = false;
  private readonly baseUrl = environment.baseUrl;
  resData: any;

  constructor(
    public dialogRef: MatDialogRef<RfBoxAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      this.lat = parseFloat(data.lat)
      this.lng = parseFloat(data.lng)
      this.angForm.setValue({
        device_id: data.device_id ? data.device_id : null,
        device_name: data.device_name ? data.device_name : null,
        score: data.score ? data.score : null,
        lat: data.lat ? data.lat : null,
        lng: data.lng ? data.lng : null,
      });
    }
  }
  groups = this.data;

  get fc() {
    return this.angForm.controls;
  }

  getErrorMessage(field, displayname) {
    if (this.angForm.controls[field].hasError('required')) {
      return `${displayname} is required.`;
    }
    if (this.angForm.controls[field].hasError('email')) {
      return `${displayname} is invalid.`;
    }
    if (
      this.angForm.controls[field].errors.pattern.requiredPattern ==
      '^[a-z0-9_]+$'
    ) {
      return `Only lowercase alphanumeric allowed.`;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formsubmit() {
    if (this.edit) {
      if (this.angForm.valid) {
        var url = `${this.baseUrl}updateRFDeviceData`;
        let data = this.angForm.value;
        data.id = this.id;

        this.ajaxService.post(data, url).subscribe((data) => {
          this.resData = data;
          let dynamicSnackColor = 'blue-snackbar';
          if (this.resData.status == 'false') {
            dynamicSnackColor = 'red-snackbar';
          }
          this.snackBar.open(this.resData.msg, null, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        });
      }
    } else {
      if (this.angForm.valid) {
        var url = `${this.baseUrl}insertRFDeviceData`;
        this.ajaxService.post(this.angForm.value, url).subscribe((data) => {
          this.resData = data;
          let dynamicSnackColor = 'blue-snackbar';
          if (this.resData.status == 'false') {
            dynamicSnackColor = 'red-snackbar';
          }
          this.snackBar.open(this.resData.msg, null, {
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
    var url =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      this.location +
      '&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8';

    return this.ajaxService.getLocation(url).subscribe((data: any) => {
      if (
        typeof data != 'undefined' &&
        data != '' &&
        typeof data.results != 'undefined' &&
        data.results != ''
      ) {
        var lattitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;
        this.lat = lattitude;
        this.lng = longitude;
        return data;
      }
    });
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }
}

