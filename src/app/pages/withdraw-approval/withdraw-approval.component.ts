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
@Component({
  selector: "app-withdraw-approval",
  templateUrl: "./withdraw-approval.component.html",
  styleUrls: ["./withdraw-approval.component.scss"],
})
export class WithdrawApprovalComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public showSearch: boolean = false;
  public searchText: string;
  public type: string = "all";
  public dataSource: any;
  public displayedColumns = [
    "serial_number",
    "player_id",
    "email_id",
    "ac_name",
    "ac_no",
    "withdrawal_amount",
    "requested_date",
    "action",
  ];
  resData: any;
  constructor(
    private snackBar: MatSnackBar,
    private ajaxService: AjaxService,
    private router: Router,
    private appSettings: AppSettings,
    private dialog: MatDialog
  ) {
    this.settings = this.appSettings.settings;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.getWithdrawRequest();
  }

  getWithdrawRequest() {
    const url = `${this.baseUrl}getWithdrawRequest`;
    //Aprrove 0 means get only not approved request AND 1 on vise versa.
    const req = { approve: 0 };
    this.ajaxService.post(req, url).subscribe(
      (result) => {
        this.resData = result;
        this.dataSource = new MatTableDataSource<Element>(result["data"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log("error");
        this.snackBar.open("Failed to load!", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  //pop-up box
  openDialog(name): void {
    let dialogRef = this.dialog.open(DialogElementsApprovalDialog, {
      data: { name: name },
      height: "160px",
      width: "300px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!["", undefined, null, false].includes(result)) {
        this.approveRequest(result);
      }
    });
  }

  approveRequest(id) {
    const url = `${this.baseUrl}approveRequest`;
    const req = { id: id };
    this.ajaxService.post(req, url).subscribe((result) => {
      this.getWithdrawRequest();
      this.snackBar.open("Request has been approved.", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["blue-snackbar"],
      });
    });
  }
}
//End

@Component({
  selector: "dialog-elements-approval-dialog",
  templateUrl: "./dialog-elements-approval-dialog.html",
})
export class DialogElementsApprovalDialog {
  constructor(
    private dialogRef: MatDialogRef<DialogElementsApprovalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  approve(data) {
    this.dialogRef.close(data);
  }

  cancelApprove(data) {
    this.dialogRef.close(false);
  }
}
