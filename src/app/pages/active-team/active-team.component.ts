import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';

@Component({
  selector: 'app-active-team',
  templateUrl: './active-team.component.html',
  styleUrls: ['./active-team.component.scss'],
})
export class ActiveTeamComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = 'all';
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  resData: any;
  public displayedColumns = [
    'id',
    'team_name',
    'leaderboard',
    'code_enabled',
    'edit',
  ];
  public dataSource: any;
  public dataSourceLocation: any;
  public showMore = false;
  public pageNumber = 1;
  public limit = 10;
  private readonly baseUrl = environment.baseUrl;

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

  ngOnInit() {
    this.getChairtyList();
  }

  onPaginateChange(pagedata) {
    this.pageNumber = parseInt(pagedata.pageIndex) + 1;
    this.limit = pagedata.pageSize;
    this.getChairtyList();
  }
  getChairtyList() {
    // var url = `${this.baseUrl}getCharityList?page=${this.pageNumber}&limmit=${this.limit}`;
    var url = `${this.baseUrl}getTeamList`;
    this.ajaxService.get(url).subscribe(
      (data: any) => {
        data.response.map((it, i) => {
          it.id = i + 1;
        });
        this.dataSource = new MatTableDataSource<Element>(data['response']);
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
        } else {
          this.snackBar.open('Failed to load!', null, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar'],
          });
        }
      }
    );
  }
  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditDialog(data) {
    let dialogRef = this.dialog.open(EditActiveStatusDialogBox, {
      data: data,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getChairtyList();
    });
  }

  openAddDialog() {
    let dialogRef = this.dialog.open(AddActiveStatusDialogBox, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getChairtyList();
    });
  }

  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this Charity?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '700px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        const url = `${this.baseUrl}deleteCharity`;
        var data = {
          id: id,
        };
        this.ajaxService.post(data, url).subscribe(
          (data) => {
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
            this.getChairtyList();
          },
          (error) => {
            if (error.status === 403) {
              this.snackBar.open('Session Timed Out! Please Login', null, {
                duration: 1700,
                verticalPosition: 'top',
                panelClass: ['red-snackbar'],
              });
              this.router.navigate(['/login']);
            } else {
              this.snackBar.open('Failed to load!', null, {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['red-snackbar'],
              });
            }
          }
        );
      }
    });
  }
}

@Component({
  selector: 'add-active-status',
  templateUrl: './add-active-status.html',
})
export class AddActiveStatusDialogBox {
  form: FormGroup;
  title = '';
  description = '';
  imageSrc: any;
  resData: any;
  angForm: FormGroup;
  Fund: string = '0';
  edit: Boolean = false;
  activestatus = 0;
  leaderboards = [];
  schoolteams = [];
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<AddActiveStatusDialogBox>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getallLeaderboards();
    this.angForm = this.fb.group({
      leaderboard: ['', [Validators.required]],
      team_name: ['', [Validators.required]],
    });
    if (data) {
      console.log(data);
      this.edit = true;
      this.angForm.setValue({
        leaderboard: data.leaderboard ? data.leaderboard : null,
        team_name: data.team_name ? data.team_name : null,
      });
      this.activestatus = data.is_team_id_enabled ? data.is_team_id_enabled : 0;
      console.log(this.activestatus);
    }
  }

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
  }

  getallLeaderboards() {
    var url = `${this.baseUrl}getSchoolleaderboard`;
    this.ajaxService.get(url).subscribe((data) => {
      this.leaderboards = data['response'];
    });
  }

  getSchoolTeams(id) {
    var url = `${this.baseUrl}getSchoolTeams`;
    let data = {
      circuit_id: id,
    };
    this.ajaxService.post(data, url).subscribe((data) => {
      this.schoolteams = data['response'];
    });
  }

  onChange(e) {
    if (e.value) {
      this.getSchoolTeams(e.value);
    } else {
      console.log('no id');
    }
  }

  formsubmit() {
    console.log(this.angForm.value);
    if (this.angForm.valid) {
      const url = `${this.baseUrl}editTeamStatus`;
      var data = {
        team_id: this.angForm.value.team_name,
        active_status: this.activestatus,
      };
      console.log(data);
      this.ajaxService.post(data, url).subscribe(
        (data) => {
          console.log(data);
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
        },
        (error) => {
          if (error.status === 403) {
            this.snackBar.open('Session Timed Out! Please Login', null, {
              duration: 1700,
              verticalPosition: 'top',
              panelClass: ['red-snackbar'],
            });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open('Failed to load!', null, {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar'],
            });
          }
        }
      );
    } else {
      console.log('no nothing');
    }
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
  }
}

@Component({
  selector: 'edit-active-status',
  templateUrl: './edit-active-status.html',
})
export class EditActiveStatusDialogBox {
  form: FormGroup;
  resData: any;
  angForm: FormGroup;
  edit: Boolean = false;
  activestatus = '0';
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<EditActiveStatusDialogBox>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.angForm = this.fb.group({
      leaderboard: ['', [Validators.required]],
      team_name: ['', [Validators.required]],
      team_id: ['', [Validators.required]],
    });
    if (data) {
      this.edit = true;
      this.angForm.setValue({
        leaderboard: data.leaderboard ? data.leaderboard : null,
        team_name: data.team_name ? data.team_name : null,
        team_id: data.team_id ? data.team_id : null,
      });
      this.activestatus = data.is_team_id_enabled
        ? data.is_team_id_enabled.toString()
        : '0';
      console.log(this.activestatus);
    }
  }

  formsubmit() {
    if (this.activestatus == '0') {
      const url = `${this.baseUrl}editTeamStatus`;
      var data = {
        team_id: this.angForm.value.team_id,
        active_status: this.activestatus,
      };
      this.ajaxService.post(data, url).subscribe(
        (data) => {
          console.log(data);
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
        },
        (error) => {
          if (error.status === 403) {
            this.snackBar.open('Session Timed Out! Please Login', null, {
              duration: 1700,
              verticalPosition: 'top',
              panelClass: ['red-snackbar'],
            });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open('Failed to load!', null, {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar'],
            });
          }
        }
      );
    }else{
      this.dialogRef.close();
    }
  }
}
