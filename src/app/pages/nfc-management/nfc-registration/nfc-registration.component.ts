import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { AppSettings } from "src/app/app.settings";
import { Settings } from "src/app/app.settings.model";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";
import { environment } from "src/environments/environment";
import { NfcService } from "../../../pages/nfc-management/nfc.service";
import { RegisterDialogComponent } from "./register-dialog/register-dialog.component";

export interface Element {
  player_id: string;
  category: string;
  created_at: string;
  date_of_birth: string;
  fullname: string;
  gender: string;
  password: string;
  team_name: string;
}

@Component({
  selector: "app-nfc-registration",
  templateUrl: "./nfc-registration.component.html",
  styleUrls: ["./nfc-registration.component.scss"],
})
export class NfcRegistrationComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public settings: Settings;
  public form!: FormGroup;
  public searchKey!: string;
  public displayedColumns = [
    'serial_number',
    'player_id',
    'fullname',
    'password',
    'date_of_birth',
    'gender',
    'team_name',
    'created_at'
  ];
  public dataSource: MatTableDataSource<Element>;

  constructor(
    private appSettings: AppSettings,
    private dialog: MatDialog,
    public snackbar: SnackBarComponent,
    private nfcService: NfcService
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource();
  }
  public $function = new Subject();
  ngOnInit(): void {
    this.getNfcPlayers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getNfcPlayers();
      }
    });
  }

  private safeAtob(str: string): string {
    if (!str) return '';
    try {
      return atob(str);
    } catch (e) {
      return str;
    }
  }

  private formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date as string;
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return date as string;
    }
  }

  private getNfcPlayers() {
    this.nfcService.getNfcPlayers({ type: 'parent' }).subscribe({
      next: (result: any) => {
        if (result && result.response) {
          const transformedData = result.response.map((item: any) => ({
            ...item,
            player_id: this.safeAtob(item.player_id),
            fullname: this.safeAtob(item.fullname),
            password: this.safeAtob(item.password),
            date_of_birth: this.formatDate(item.date_of_birth),
            gender: item.gender || 'N/A',
            team_name: this.safeAtob(item.team_name),
            created_at: this.formatDate(item.created_at)
          }));
          
          this.dataSource.data = transformedData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error fetching NFC players:', error);
        this.snackbar.openSnackBar('Error fetching players', 'error', 3000);
      }
    });
  }
}
