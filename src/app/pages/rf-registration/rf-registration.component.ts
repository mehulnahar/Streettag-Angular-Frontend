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

  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(RfidAddDialog, {
      width: '600px',
      data: { ...data, circuits: this.circuits, edit: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getallUsers();
        this.snackBar.open('Player updated successfully!', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['blue-snackbar']
        });
      }
    });
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFCircuitData`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.circuits = data['data'];
    });
  }

  openDetailDialog(data: any): void {
    const dialogRef = this.dialog.open(RfidViewDialog, {
      width: '600px',
      data: data
    });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(RfidAddDialog, {
      width: '600px',
      data: { circuits: this.circuits }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getallUsers();
      }
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete player ${data.player_id}?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
      if (dialogResult) {
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
  template: `
    <h2 mat-dialog-title>{{edit ? 'Edit Player' : 'Add Player'}}</h2>
    <form [formGroup]="angForm" (ngSubmit)="formsubmit()">
      <mat-dialog-content>
        <div class="form-container">
          <mat-form-field>
            <mat-label>RF ID</mat-label>
            <input matInput formControlName="rf_id" required>
            <mat-error *ngIf="angForm.controls['rf_id'].hasError('required')">RF ID is required</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Player ID</mat-label>
            <input matInput formControlName="player_id" required>
            <mat-error *ngIf="angForm.controls['player_id'].hasError('required')">Player ID is required</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullname" required>
            <mat-error *ngIf="angForm.controls['fullname'].hasError('required')">Full Name is required</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
            <mat-error *ngIf="angForm.controls['email'].hasError('email')">Please enter a valid email</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Date of Birth</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date_of_birth">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Postal Code</mat-label>
            <input matInput formControlName="postal_code">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Circuit</mat-label>
            <mat-select formControlName="circuit_id" required>
              <mat-option *ngFor="let circuit of circuits" [value]="circuit.id">
                {{circuit.circuit_name}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="angForm.controls['circuit_id'].hasError('required')">Circuit is required</mat-error>
          </mat-form-field>

          <div class="radio-group">
            <label class="radio-label">Gender</label>
            <mat-radio-group formControlName="gender">
              <mat-radio-button value="male">Male</mat-radio-button>
              <mat-radio-button value="female">Female</mat-radio-button>
              <mat-radio-button value="other">Other</mat-radio-button>
            </mat-radio-group>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onNoClick()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!angForm.valid">
          {{edit ? 'Update' : 'Save'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-container {
      display: grid;
      gap: 16px;
      padding: 20px 15px;
    }
    mat-form-field {
      width: 100%;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .radio-label {
      color: rgba(0,0,0,0.6);
      font-size: 14px;
    }
    ::ng-deep .mat-mdc-dialog-content {
      padding: 0 !important;
    }
    mat-radio-group {
      display: flex;
      gap: 16px;
    }
  `]
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
    // Initialize circuits from the data passed by parent component
    this.circuits = data.circuits || [];
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

          this.dialogRef.close(true);
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

          this.dialogRef.close(true);
        });
      }
    }
  }
}

@Component({
  selector: 'app-rfid-view-dialog',
  template: `
    <h2 mat-dialog-title>Player Details</h2>
    <mat-dialog-content>
      <div class="details-container">
        <div class="detail-row">
          <strong>RF ID:</strong> {{data.rf_id}}
        </div>
        <div class="detail-row">
          <strong>Player ID:</strong> {{data.player_id}}
        </div>
        <div class="detail-row">
          <strong>Full Name:</strong> {{data.fullname}}
        </div>
        <div class="detail-row">
          <strong>Email:</strong> {{data.email || 'N/A'}}
        </div>
        <div class="detail-row">
          <strong>Date of Birth:</strong> {{data.date_of_birth || 'N/A'}}
        </div>
        <div class="detail-row">
          <strong>Postal Code:</strong> {{data.postal_code || 'N/A'}}
        </div>
        <div class="detail-row">
          <strong>Gender:</strong> {{data.gender || 'N/A'}}
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .details-container {
      display: grid;
      gap: 16px;
      padding: 20px;
    }
    .detail-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 16px;
      align-items: center;
    }
    strong {
      color: rgba(0,0,0,0.6);
    }
  `]
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

