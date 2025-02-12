import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { fadeOut } from '../../theme/utils/app-animation';

export interface AutoState {
  id: number;
  location_id: number;
  circuit_id: number;
  emails: string[];
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-auto-states',
  templateUrl: './auto-states.component.html',
  styleUrls: ['./auto-states.component.scss'],
  animations: [fadeOut]
})
export class AutoStatesComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  public angForm!: FormGroup;
  public dataSourceLocation$: Observable<any> = new Observable<any>();
  public dataSourceCircuit$: Observable<any> = new Observable<any>();
  private readonly baseUrl = environment.baseUrl;
  
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailArray: string[] = [];
  
  displayedColumns = [
    'serial_number',
    'location_name',
    'circuit_name',
    'emails',
    'edit',
    'delete'
  ];
  
  dataSource = new MatTableDataSource<AutoState>();

  constructor(
    private ajaxService: AjaxService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const url = `${this.baseUrl}getAllAutoStatesEmails`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<AutoState>(data['response']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddMessageDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '60%',
      disableClose: true,
      autoFocus: true,
      panelClass: ['animate__animated', 'animate__zoomIn']
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadData();
      }
    });
  }

  edit(dataObj: AutoState) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '60%',
      disableClose: true,
      autoFocus: true,
      panelClass: ['animate__animated', 'animate__zoomIn'],
      data: dataObj
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadData();
      }
    });
  }

  delete(dataObj: AutoState) {
    const message = `Are you sure you want to Delete ${dataObj.circuit_id} emails and cannot be undone?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '32rem',
      data: dialogData,
      panelClass: ['animate__animated', 'animate__jackInTheBox'],
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((dialogResult: any) => {
      if (dialogResult === true) {
        const url = `${this.baseUrl}deleteAutoState`;
        this.ajaxService.post({ id: dataObj.id }, url).subscribe(
          () => {
            this.dataSource.data = this.dataSource.data.filter(
              (value: AutoState) => value.id !== dataObj.id
            );
            this.snackBar.open('Deleted Successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar']
            });
          },
          (error: any) => {
            this.snackBar.open('Something went wrong, please try again', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
        );
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
