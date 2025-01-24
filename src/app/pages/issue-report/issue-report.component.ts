import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

@Component({
  selector: "app-issue-report",
  templateUrl: "./issue-report.component.html",
  styleUrls: ["./issue-report.component.scss"],
})
export class IssueReportComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "title",
    "comments",
    "uploaded_by",
    "created_at",
    "steps_image"
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
    this.getIssueReports();
  }

  onPaginateChange(pagedata) {
    this.pageNumber = parseInt(pagedata.pageIndex) + 1;
    this.limit = pagedata.pageSize;
    this.getIssueReports();
  }
  getIssueReports() {
    var url = `${this.baseUrl}getisseReported`;
    this.ajaxService.get(url).subscribe(
      (data) => {
        data["response"].map((it,i)=>{
          it.serial_number = i+1
        })
        this.dataSource = new MatTableDataSource<Element>(data["response"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open("Session Timed Out! Please Login", null, {
            duration: 1700,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.router.navigate(["/login"]);
        } else {
          this.snackBar.open("Failed to load!", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      }
    );
  }
  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this Charity?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
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
              let dynamicSnackColor = "blue-snackbar";
              if (this.resData.status == "false") {
                dynamicSnackColor = "red-snackbar";
              }
              this.snackBar.open(this.resData.msg, null, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: dynamicSnackColor,
              });
              this.getIssueReports();
            },
            (error) => {
              if (error.status === 403) {
                this.snackBar.open("Session Timed Out! Please Login", null, {
                  duration: 1700,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                });
                this.router.navigate(["/login"]);
              } else {
                this.snackBar.open("Failed to load!", null, {
                  duration: 3000,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                });
              }
            }
          );
        
      }
    });
  }
}




