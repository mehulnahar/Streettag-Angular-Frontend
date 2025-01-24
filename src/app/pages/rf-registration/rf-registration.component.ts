import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { AjaxService } from 'src/app/ajax.service';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-rf-registration',
  templateUrl: './rf-registration.component.html',
  styleUrls: ['./rf-registration.component.scss'],
})
export class RfRegistrationComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;

  public newMail: boolean;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  public i = 0;

  public show_dialog: boolean = false;
  public button_name: any = 'Show Login Form!';
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = '';
  circuits: any = [];
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    'id',
    'rf_id',
    'player_id',
    'fullname',
    'email',
    'actions',
  ];
  public dataSource: any;

  lastelementData: any;

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

    this.getallUsers();
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
    let dialogRef = this.dialog.open(RfidAddDialog, {
      width: '600px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getallUsers();
    });
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFCircuitData`;
    this.ajaxService.get(url).subscribe((data) => {
      this.circuits = data['data'];
    });
  }

  openDetailDialog(data): void {
    data.circuit_id = this.circuits.filter((it) => it.id == data.circuit_id);
    let dialogRef = this.dialog.open(RfidViewDialog, {
      width: '600px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getallUsers();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(RfidAddDialog, {
      width: '600px',
      data: { groups: this.groupList.result },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getallUsers();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete player ${data.player_id} ?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteRFData(data.id);
      }
    });
  }

  getallUsers() {
    var url = `${this.baseUrl}getRFData`;
    this.ajaxService.get(url).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<Element>(data['data']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open('Session Timed Out! Please Login', null, {
            duration: 1700,
            verticalPosition: 'top',
            panelClass: ['red-snackbar'],
          });
          this.router.navigate(['/login']);
        }
      }
    );
  }

  deleteRFData(Player_id) {
    var url = `${this.baseUrl}deleteRFData`;
    var data = { id: Player_id };
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallUsers();
        this.snackBar.open('Player deleted Successfully!', null, {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        console.error('Error');
      }
    );
  }
}

@Component({
  selector: 'rfid-add-dialog',
  templateUrl: 'rfid-add-dialog.html',
})
export class RfidAddDialog {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = '';
  id: number;
  edit: boolean = false;
  public dataSource: any;
  formateddate;
  circuits: any = [];

  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<RfidAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.getallCircuits();
    this.dateAdapter.setLocale('en-GB');
    this.angForm = this.formBuilder.group({
      rf_id: ['', Validators.required],
      player_id: [
        '',
        [Validators.required],
      ],
      fullname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      date_of_birth: [''],
      postal_code: [''],
      gender: ['male'],
      circuit_id: ['', Validators.required],
    });

    if (data && data.id) {
      this.edit = true;
      this.id = data.id;
      if (data.date_of_birth) {
        this.formateddate = moment(data.date_of_birth, 'DD/MM/YYYY').format(
          'MM/DD/YYYY'
        );
      }
      this.angForm.setValue({
        rf_id: data.rf_id ? data.rf_id : null,
        player_id: data.player_id ? data.player_id : null,
        fullname: data.fullname ? data.fullname : null,
        email: data.email ? data.email : null,
        date_of_birth: data.date_of_birth ? new Date(this.formateddate) : null,
        postal_code: data.postal_code ? data.postal_code : null,
        gender: data.gender ? data.gender : null,
        circuit_id: data.circuit_id ? data.circuit_id : null,
      });
    }
  }
  groups = this.data;

  get fc() {
    return this.angForm.controls;
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFCircuitData`;
    this.ajaxService.get(url).subscribe((data) => {
      this.circuits = data['data'];
    });
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
      '^[a-zA-Z_ ]+$'
    ) {
      return `Only text values allowed.`;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formsubmit() {
    if (this.edit) {
      if (this.angForm.valid) {
        let dob = moment(this.angForm.get('date_of_birth').value).format(
          'DD/MM/YYYY'
        );
        this.angForm.get('date_of_birth').setValue(dob);
        var url = `${this.baseUrl}updateRFData`;
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
        if(this.angForm.get('date_of_birth').value){
          let dob = moment(this.angForm.get('date_of_birth').value).format(
            'DD/MM/YYYY'
          );
          this.angForm.get('date_of_birth').setValue(dob);
        }
        var url = `${this.baseUrl}insertRFData`;
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
}

@Component({
  selector: 'rfid-view-dialog',
  templateUrl: './rfid-view-dialog.html',
  styles: [
    'tr {height: 40px; border-bottom: 1px solid #b8b7b7;} ',
  ],
})
export class RfidViewDialog {
  constructor(
    public dialogRef: MatDialogRef<RfidAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

