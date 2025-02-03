import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
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
import { ExcelService } from "../../excel.service";
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';

export interface ConsentElement {
  serial_number: number;
  fullname: string;
  email: string;
  phone_number: string;
  created_at: string;
  share_info: string;
}

@Component({
  selector: "app-consents",
  templateUrl: "./consents.component.html",
  styleUrls: ["./consents.component.scss"],
  encapsulation: ViewEncapsulation.None,
 })
export class ConsentsComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;

  public newMail!: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form!: FormGroup;

  public show_dialog: boolean = false;
  public button_name: any = "Show Login Form!";
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    "serial_number",
    "fullname",
    "email",
    "created_at",
    "phone_number",
    "share_info",
  ];
  public dataSource: MatTableDataSource<ConsentElement>;
  data: ConsentElement[] = [];

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService,
    private excelService: ExcelService,
    private http: HttpClient
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<ConsentElement>([]);
    this.form = this.formBuilder.group({
      search: ['']
    });
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, "consent-data");
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getConsents();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
    }
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  public getConsents() {
    this.http.get(`${environment.baseUrl}api/admin/consents`).subscribe({
      next: (response: any) => {
        if (response && response.response) {
          this.data = response.response;
          this.dataSource = new MatTableDataSource<ConsentElement>(response.response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error fetching consents:', error);
        this.snackBar.open('Error loading consents', undefined, {
          duration: 2000
        });
      }
    });
  }

  deleteBuilding(id:any) {
    var getdata = {};
    var url = `${this.baseUrl}deleteBuilding`;
    var data = { id: id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getConsents();
        this.snackBar.open(" deleted Successfully!", undefined, {
          duration: 3000,
          verticalPosition: "top",
        });
      },
      (error) => {
      }
    );
  }
}
