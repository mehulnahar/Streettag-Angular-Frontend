import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AjaxService } from 'src/app/ajax.service';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Moment } from 'moment';

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

export interface RfRegistration {
  id: number;
  rf_id: string;
  player_id: string;
  circuit_id: number;
  fullname: string;
  email: string;
  gender: string;
  date_of_birth: string;
  postal_code: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-rf-registration',
  templateUrl: './rf-registration.component.html',
  styleUrls: ['./rf-registration.component.scss'],
})
export class RfRegistrationComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;

  public newMail: boolean = false;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string = '';
  public form!: FormGroup;
  public i = 0;

  public show_dialog: boolean = false;
  public button_name: any = 'Show Login Form!';
  groupList: any[] = [];
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  Location_name: string = '';
  circuits: any[] = [];
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    'id',
    'rf_id',
    'player_id',
    'fullname',
    'email',
    'actions'
  ];
  public dataSource: MatTableDataSource<RfRegistration>;

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
    this.dataSource = new MatTableDataSource<RfRegistration>();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

    // Load RF devices
    this.loadRfDevices();
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

  openEditDialog(data:any): void {
    let dialogRef = this.dialog.open(RfidAddDialog, {
      width: '600px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.getallUsers();
    });
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFCircuitData`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.circuits = data['data'];
    });
  }

  openDetailDialog(data: any): void {
    data.circuit_id = this.circuits.filter((it: any) => it.id == data.circuit_id);
    let dialogRef = this.dialog.open(RfidViewDialog, {
      width: '600px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getallUsers();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(RfidAddDialog, {
      width: '600px',
      data: { groups: this.groupList }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
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

    dialogRef.afterClosed().subscribe((dialogResult:any ) => {
      if (dialogResult == true) {
        this.deleteRFData(data.id);
      }
    });
  }

  getallUsers() {
    var url = `${this.baseUrl}getRFData`;
    this.ajaxService.get(url).subscribe(
      (data: any) => {
        this.dataSource.data = data['data'];
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open('Session Timed Out! Please Login', '', {
            duration: 1700,
            verticalPosition: 'top',
            panelClass: ['red-snackbar'],
          });
          this.router.navigate(['/login']);
        }
      }
    );
  }

  deleteRFData(playerId: string) {
    var url = `${this.baseUrl}deleteRFData`;
    var data = { id: playerId };
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallUsers();
        this.snackBar.open('Player deleted Successfully!', '', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        console.error('Error');
      }
    );
  }

  loadRfDevices() {
    // TODO: Implement API call to load RF devices
    // For now using mock data
    const mockData: RfRegistration[] = [
      {
        id: 1,
        rf_id: 'RF001',
        player_id: 'Player1',
        circuit_id: 1,
        fullname: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        date_of_birth: '1990-05-15',
        postal_code: '10001',
        is_deleted: 0,
        created_at: '2024-03-20 10:30:00',
        updated_at: '2024-03-20 10:30:00'
      },
      {
        id: 2,
        rf_id: 'RF002',
        player_id: 'Player2',
        circuit_id: 2,
        fullname: 'Jane Smith',
        email: 'jane@example.com',
        gender: 'female',
        date_of_birth: '1995-07-20',
        postal_code: '10002',
        is_deleted: 0,
        created_at: '2024-03-19 15:45:00',
        updated_at: '2024-03-19 15:45:00'
      }
    ];
    this.dataSource.data = mockData;
  }

  registerNewDevice() {
    // TODO: Implement register new device dialog
    console.log('Register new device clicked');
  }

  editDevice(device: RfRegistration) {
    // TODO: Implement edit device dialog
    console.log('Edit device clicked', device);
  }

  deleteDevice(device: RfRegistration) {
    const message = `Are you sure you want to delete device ${device.id}?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
        // TODO: Implement delete device API call
        console.log('Delete device confirmed', device);
      }
    });
  }
}

@Component({
  selector: 'app-rfid-add-dialog',
  template: '<!-- Your template here -->'
})
export class RfidAddDialog {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public settings!: Settings;
  form!: FormGroup;
  groupList: any[] = [];
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  location_name: string = '';
  id!: number;
  edit: boolean = false;
  public dataSource: any;
  formateddate: string = '';
  circuits: any[] = [];
  angForm!: FormGroup;
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
    this.ajaxService.get(url).subscribe((data: any) => {
      this.circuits = data['data'];
    });
  }

  getErrorMessage(field: string, displayname: string): string {
    if (this.angForm.controls[field]?.errors?.['required']) {
      return `${displayname} is required`;
    }
    if (this.angForm.controls[field]?.errors?.['pattern']) {
      return `Invalid ${displayname}`;
    }
    return '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formsubmit() {
    if (this.angForm.valid) {
      const formValue = this.angForm.value;
      const dateValue = formValue.date_of_birth;
      const dob = dateValue ? moment(dateValue).format('DD/MM/YYYY') : '';
      
      if (this.edit) {
        const url = `${this.baseUrl}updateRFData`;
        const data = {
          ...this.angForm.value,
          id: this.id,
          date_of_birth: dob
        };

        this.ajaxService.post(data, url).subscribe((response: any) => {
          this.resData = response;
          const dynamicSnackColor = this.resData.status === 'false' ? 'red-snackbar' : 'blue-snackbar';
          
          this.snackBar.open(this.resData.msg, '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: dynamicSnackColor,
          });

          this.dialogRef.close();
        });
      } else {
        const url = `${this.baseUrl}insertRFData`;
        const data = {
          ...this.angForm.value,
          date_of_birth: dob
        };

        this.ajaxService.post(data, url).subscribe((response: any) => {
          this.resData = response;
          const dynamicSnackColor = this.resData.status === 'false' ? 'red-snackbar' : 'blue-snackbar';
          
          this.snackBar.open(this.resData.msg, '', {
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
  selector: 'app-rfid-view-dialog',
  template: '<!-- Your template here -->'
})
export class RfidViewDialog {
  constructor(
    public dialogRef: MatDialogRef<RfidViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

