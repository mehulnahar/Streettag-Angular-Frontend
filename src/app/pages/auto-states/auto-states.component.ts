import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { pluck } from 'rxjs-compat/operators/pluck';
import { Observable } from 'rxjs/observable';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AddDialogComponent} from './add-dialog/add-dialog.component'
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {fadeOut} from '../../theme/utils/app-animation'
@Component({
  selector: 'app-auto-states',
  templateUrl: './auto-states.component.html',
  styleUrls: ['./auto-states.component.scss'],
  animations: [fadeOut]
})
export class AutoStatesComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public angForm: FormGroup;
  public dataSource: any;
  public dataSourceLocation$: Observable<any>;
  public dataSourceCircuit$:Observable<any>;
  private readonly baseUrl = environment.baseUrl;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailArray = [];
  public displayedColumns = [
    "serial_number",
    "location_name",
    "circuit_name",
    "emails",
    "edit",
    "delete"
   ];
  constructor(
    private ajaxService: AjaxService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getallCircuits();
  }

  getallCircuits() {
    const url = `${this.baseUrl}getAllAutoStatesEmails`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     });
  }


  openAddMessageDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['animate__animated','animate__zoomIn'];
    let dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }

  edit(dataObj:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['animate__animated','animate__zoomIn'];
    dialogConfig.data = dataObj;
    let dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
       this.getallCircuits();
    });
  }

  delete(dataObj:any){
      const message = `Are you sure you want to Delete ${dataObj.circuit_name} emails and cannot be undone?`;
      const dialogData = new ConfirmDialogModel("Confirm Action", message)
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "32rem",
        data: dialogData,
        panelClass : ['animate__animated','animate__jackInTheBox'],
        disableClose : true
      });
  
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult == true) {
          const url = `${this.baseUrl}deleteAutoState  `;
          this.ajaxService.post({id : dataObj.id}, url).subscribe(
            (data) => {
              //Delete data from dataSource
              this.dataSource.data = this.dataSource.data.filter((value,key)=>{
                return value.id != dataObj.id
              })
              this.snackBar.open("Deleted Successfully!", null, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: ["blue-snackbar"],
              });
            },
            (error) => {
                this.snackBar.open("Something went wrong, please try again", null, {
                  duration: 2000,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                });
            });
        }
      });
  }

 

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
