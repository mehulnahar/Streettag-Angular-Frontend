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
  selector: 'app-rf-circuit',
  templateUrl: './rf-circuit.component.html',
  styleUrls: ['./rf-circuit.component.scss'],
})
export class RfCircuitComponent implements OnInit {
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
    let dialogRef = this.dialog.open(RfCircuitAddDialog, {
      width: '600px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //  this.name = result;
      //this.openDialog();
      //  this.getMsggroups();

      //  this.getallevent();
      //  this.viewDetail(result);
      //  this.toggle();
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(RfCircuitAddDialog, {
      width: '600px',
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //  this.name = result;
      //this.openDialog()

      this.getallCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallCircuits() {
    var url = `${this.baseUrl}getRFCircuitData`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data['data']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ////////////////////delete Dialoge///////////////////
  // OpenDelete(id): void {

  //   let dialogRef = this.dialog.open(DeletedialogCircuit, {
  //     data: { name: "" }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //     this.delresult = result;
  //     if (this.delresult == "1")
  //       this.deleteCircuit(id);
  //   });
  // }

  confirmDialog(data:any):void {
    const message = `Are you sure you want to delete ${data.circuit_name} ?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        var url = `${this.baseUrl}deleteRFCircuitData`;
        var dataobj = { id: data.id };

        this.ajaxService.post(dataobj, url).subscribe(
          (data) => {
            this.resData = data;
            this.getallCircuits();
            this.snackBar.open('RF Circuit deleted Successfully!', null, {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          (error) => {
            //console.error("Error");
          }
        );
      }
    });
  }
}

@Component({
  selector: 'add-rf-circuit',
  templateUrl: 'add-rf-circuit.html',
})
export class RfCircuitAddDialog {
  angForm: FormGroup;
  id: number;
  edit: boolean = false;
  formateddate;
  private readonly baseUrl = environment.baseUrl;
  resData: any;

  constructor(
    public dialogRef: MatDialogRef<RfCircuitAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.angForm = this.formBuilder.group({
      circuit_name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z_ ]+$')],
      ],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });

    if (data && data.id) {
      this.edit = true;
      this.id = data.id;
      this.angForm.setValue({
        circuit_name: data.circuit_name ? data.circuit_name : null,
        start_date: data.start_date ? data.start_date : null,
        end_date: data.end_date ? data.end_date : null,
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
        let stdate = moment(this.angForm.get('start_date').value).format(
          'YYYY-MM-DD'
        );
        this.angForm.get('start_date').setValue(stdate);
        let enddate = moment(this.angForm.get('end_date').value).format(
          'YYYY-MM-DD'
        );
        this.angForm.get('end_date').setValue(enddate);
        var url = `${this.baseUrl}updateRFCircuitData`;
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
        let stdate = moment(this.angForm.get('start_date').value).format(
          'YYYY-MM-DD'
        );
        this.angForm.get('start_date').setValue(stdate);
        let enddate = moment(this.angForm.get('end_date').value).format(
          'YYYY-MM-DD'
        );
        this.angForm.get('end_date').setValue(enddate);
        var url = `${this.baseUrl}insertRFCircuitData`;
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

