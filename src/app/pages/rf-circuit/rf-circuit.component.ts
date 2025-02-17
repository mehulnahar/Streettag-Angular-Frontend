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
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import moment from 'moment';

export interface RfCircuit {
  id: number;
  circuit_name: string;
  start_date: string;
  end_date: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  serial_number: number;
}

@Component({
  selector: 'app-rf-circuit',
  templateUrl: './rf-circuit.component.html',
  styleUrls: ['./rf-circuit.component.scss']
})
export class RfCircuitComponent implements OnInit {
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

  public show_dialog: boolean = false;
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
    'circuit_name',
    'start_date',
    'end_date',
    'actions'
  ];
  public dataSource: MatTableDataSource<RfCircuit>;
  public dataSourceLocation: any;
  public selectedValue: string = '';
  public picker1: any;
  public picker2: any;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<RfCircuit>();
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

    this.getAllCircuits();

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
      default:
        break;
    }
  }

  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(RfCircuitAddDialog, {
      width: '600px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllCircuits();
    });
  }

  openAddMessageDialog(): void {
    const dialogRef = this.dialog.open(RfCircuitAddDialog, {
      width: '600px',
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getAllCircuits() {
    const url = `${this.baseUrl}getRFCircuitData`;
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

  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete ${data.name} ?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult: any) => {
      if (dialogResult == true) {
        var url = `${this.baseUrl}deleteRFCircuitData`;
        var dataobj = { id: data.id };

        this.ajaxService.post(dataobj, url).subscribe(
          (data) => {
            this.resData = data;
            this.getAllCircuits();
            this.snackBar.open('RF Circuit deleted Successfully!', '', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          (error) => {
            console.error('Error deleting circuit:', error);
          }
        );
      }
    });
  }

  addCircuit() {
    this.openAddMessageDialog();
  }

  editCircuit(circuit: RfCircuit) {
    this.openEditDialog(circuit);
  }

  deleteCircuit(circuit: RfCircuit) {
    this.confirmDialog(circuit);
  }
}

@Component({
  selector: 'app-rf-circuit-add-dialog',
  template: `
    <h2 mat-dialog-title>{{edit ? 'Edit Circuit' : 'Add Circuit'}}</h2>
    <form [formGroup]="angForm" (ngSubmit)="formsubmit()">
      <mat-dialog-content>
        <div class="form-container">
          <mat-form-field>
            <mat-label>Circuit Name</mat-label>
            <input matInput formControlName="circuit_name" required>
            <mat-error *ngIf="angForm.controls['circuit_name'].hasError('required')">Circuit name is required</mat-error>
            <mat-error *ngIf="angForm.controls['circuit_name'].hasError('pattern')">Only text values allowed</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="picker1" formControlName="start_date" required>
            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
            <mat-error *ngIf="angForm.controls['start_date'].hasError('required')">Start date is required</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="picker2" formControlName="end_date" required>
            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
            <mat-error *ngIf="angForm.controls['end_date'].hasError('required')">End date is required</mat-error>
          </mat-form-field>
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
    ::ng-deep .mat-mdc-dialog-content {
      padding: 0 !important;
    }
  `]
})
export class RfCircuitAddDialog {
  angForm: FormGroup;
  id: number | null = null;
  edit: boolean = false;
  formateddate: any;
  private readonly baseUrl = environment.baseUrl;
  resData: any;

  constructor(
    public dialogRef: MatDialogRef<RfCircuitAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.angForm = this.formBuilder.group({
      circuit_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z_ ]+$')]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });

    if (data && data.id) {
      this.edit = true;
      this.id = data.id;
      this.angForm.setValue({
        circuit_name: data.circuit_name || null,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
      });
    }
  }

  getErrorMessage(field: string, displayname: string): string {
    if (this.angForm.controls[field].hasError('required')) {
      return `${displayname} is required.`;
    }
    if (this.angForm.controls[field].hasError('pattern')) {
      return `Only text values allowed.`;
    }
    return '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formsubmit() {
    if (this.angForm.valid) {
      const formValue = this.angForm.value;
      const startDate = formValue.start_date ? moment(formValue.start_date).format('YYYY-MM-DD') : '';
      const endDate = formValue.end_date ? moment(formValue.end_date).format('YYYY-MM-DD') : '';
      
      const data = {
        ...formValue,
        start_date: startDate,
        end_date: endDate
      };

      if (this.edit && this.id) {
        data.id = this.id;
        const url = `${this.baseUrl}updateRFCircuitData`;
        
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
        const url = `${this.baseUrl}insertRFCircuitData`;
        
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

