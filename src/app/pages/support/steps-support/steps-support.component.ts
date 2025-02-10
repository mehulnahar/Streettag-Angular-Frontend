import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { ImageViewergModel } from 'src/app/shared/image-viewer/image-viewer.model';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { StepsSupportService } from './steps-support.service';

interface ApiResponse {
  response: StepsSupportItem[];
  status: boolean;
  message: string;
}

export interface StepsSupportItem {
  player_id: string;
  steps_image: string;
  steps: number;
  steps_status: number;
  created_at: string;
}

@Component({
  selector: 'app-steps-support',
  templateUrl: './steps-support.component.html',
  styleUrls: ['./steps-support.component.scss']
})
export class StepsSupportComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<StepsSupportItem>;
  dataSource!: MatTableDataSource<StepsSupportItem>;
  select: Date = new Date();
  minDate: Date;
  maxDate: Date;
  endDate: string;
  startDate: string;
  isChecked = true;
  displayedColumns = ['serial_number', 'player_id', 'steps', 'img', 'status', 'created_at', 'action'];

  constructor(
    private api: StepsSupportService,
    private snackbar: SnackBarComponent,
    private dialog: MatDialog,
  ) {
    const tomorrow = new Date();
    this.minDate = new Date("2019-12-30");
    this.maxDate = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
    
    // Initialize dates
    const today = new Date();
    this.endDate = this.formatDate(new Date(today.setDate(today.getDate() + 1)));
    this.startDate = this.formatDate(new Date(today.setDate(today.getDate() - 2)));
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 00:00:00`;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.fetchdata();
  }

  fetchdata() {
    this.api.getStepsSupports({ startDate: this.startDate, endDate: this.endDate }).subscribe({
      next: (data: ApiResponse) => {
        this.dataSource = new MatTableDataSource<StepsSupportItem>(data.response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.snackbar.openSnackBar('Something went wrong.', 'error', 2500);
      }
    });
  }

  datechange() {
    this.fetchdata();
  }

  OpenImageViewerBox(dataObj: StepsSupportItem) {
    const dialogData = new ImageViewergModel("Image Viewer", '', dataObj.steps_image);
    this.dialog.open(ImageViewerComponent, {
      minWidth: "50%",
      minHeight: 'calc(100vh - 90px)',
      height: '93%',
      data: dialogData,
      disableClose: true,
    });
  }

  toggle(user: StepsSupportItem, selection: number) {
    const message = `Are you sure you want to ${selection === 1 ? 'Activate' : 'Deactivate'} ${window.atob(user.player_id)} step request?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.api.updateStepSupport(user, selection).subscribe({
          next: (result: any) => {
            if (result.data.status) {
              this.fetchdata();
              return this.snackbar.openSnackBar('Updated Successfully.', 'success', 2500);
            } else {
              return this.snackbar.openSnackBar(result.data.msg, 'error', 2500);
            }
          },
          error: (error) => {
            return this.snackbar.openSnackBar('Something went wrong.', 'error', 2500);
          }
        });
      }
    });
  }
}
