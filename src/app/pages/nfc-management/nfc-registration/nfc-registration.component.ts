import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogConfig,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { AppSettings } from "src/app/app.settings";
import { Settings } from "src/app/app.settings.model";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";
import { environment } from "src/environments/environment";
import { NfcService } from "../nfc.service";
import { RegisterDialogComponent } from "./register-dialog/register-dialog.component";

@Component({
  selector: "app-nfc-registration",
  templateUrl: "./nfc-registration.component.html",
  styleUrls: ["./nfc-registration.component.scss"],
})
export class NfcRegistrationComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public form: FormGroup;
  public displayedColumns = [
    "serial_number",
    "player_id",
    "userName",
    "password",
    "dob",
    "gender",
    "team_name",
    "created_at",
  ];
  public dataSource: any;
  searchKey: String;
  constructor(
    private appSettings: AppSettings,
    private dialog: MatDialog,
    public snackbar: SnackBarComponent,
    private nfcService: NfcService
  ) {
    this.settings = this.appSettings.settings;
    this.getNfcPlayes();
  }
  public $function = new Subject();
  ngOnInit(): void {}

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  openAddMessageDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['animate__animated','animate__zoomIn'];
    let dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getNfcPlayes();
      }
    });
  }
  getNfcPlayes() {
    this.nfcService.getNfcPlayers({type : 'parent'}).subscribe((result) => {
      this.dataSource = new MatTableDataSource<Element>(result["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
