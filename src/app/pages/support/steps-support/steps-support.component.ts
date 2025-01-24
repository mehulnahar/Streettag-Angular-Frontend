import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { ImageViewergModel } from 'src/app/shared/image-viewer/image-viewer.model';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import {StepsSupportService} from './steps-support.service';
import * as moment from 'moment-mini';

export interface StepsSupportItemi {
  player_id : string;
  img : string;
  steps : number;
  status : number;
  date : Date;
}

@Component({
  selector: 'app-steps-support',
  templateUrl: './steps-support.component.html',
  styleUrls: ['./steps-support.component.scss']
})
export class StepsSupportComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<StepsSupportItemi>;
  dataSource: MatTableDataSource<StepsSupportItemi>;
  select : Date = new Date();
  minDate: Date;
  maxDate: Date;
  endDate = moment().add(1, 'days').format('YYYY-MM-DD 00:00:00');
  startDate = moment().subtract(2, 'days').format('YYYY-MM-DD 00:00:00');
  isChecked = true;
  displayedColumns = ['serial_number', 'player_id','steps', 'img','status', 'created_at','action'];

  constructor(private api : StepsSupportService, 
    private snackbar: SnackBarComponent,
    private dialog: MatDialog,
    ){
    const tomorrow = new Date();
    this.minDate = new Date("2019-12-30");
    this.maxDate = new Date (tomorrow.setDate(tomorrow.getDate()+1));
    
    }

    ngOnInit() {}

  ngAfterViewInit() {
    this.fetchdata();
  }

  fetchdata(){
    this.api.getStepsSupports({startDate:this.startDate, endDate: this.endDate}).subscribe(
      (data) => {
          this.dataSource = new MatTableDataSource<StepsSupportItemi>(data["response"]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackbar.openSnackBar('Something went wrong.','error', 2500);
      }
    )
  }

  datechange(){
    this.fetchdata();
  }

  
  OpenImageViewerBox(dataObj:any){
    console.log(dataObj)
    const message = `Image viewer`;
    const dialogData = new ImageViewergModel("Image Viewer", '' ,dataObj.steps_image);
    const dialogRef = this.dialog.open(ImageViewerComponent,  {
      minWidth : "50%",
      minHeight: 'calc(100vh - 90px)',
      height : '93%',
      data: dialogData,
      disableClose:true,
    });
}

toggle(user : any, selection : number){

  const message = `Are you sure you want to ${selection === 1 ? 'Activate' : 'Deactivate'} ${window.atob(user.player_id)} step request?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.api.updateStepSupport(user,selection).subscribe((result : any)=>{
          if(result.data.status){
              this.fetchdata();
             return this.snackbar.openSnackBar('Updated Succesfully.','success', 2500);
          }else{
            return this.snackbar.openSnackBar(result.data.msg,'error', 2500);
          }
        },
        (error) => {
           return this.snackbar.openSnackBar('Something went wrong.','error', 2500);
        });
      }
  });
}

}
