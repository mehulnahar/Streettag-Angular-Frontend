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
import { MatSort } from "@angular/material/sort";
import { interval } from 'rxjs';
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

interface GiftCardData {
  serial_number: string;
  request_id: string;
  amount: number;
  gift_card: string;
  date: string;
}

@Component({
  selector: "app-giftcard",
  templateUrl: "./giftcard.component.html",
  styleUrls: ["./giftcard.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class GiftcardComponent implements OnInit {
  @ViewChild("sidenav") sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public newMail: boolean = false;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string = "";
  public form: FormGroup;
  public i = 0;

  public show_dialog: boolean = false;
  public button_name: string = "Show Login Form!";
  groupList: any[] = [];
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  Location_name: string = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    "serial_number",
    "request_id",
    "amount",
    "gift_card",
    "date",
  ];
  public dataSource: MatTableDataSource<GiftCardData>;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<GiftCardData>();
    this.form = this.formBuilder.group({
      to: ["", Validators.required],
      cc: [null],
      subject: [null],
      message: [null],
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getallLocations();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
      default:
        break;
    }
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(create_gift_card, {
      data: { groups: this.groupList },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallLocations();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallLocations() {
    const url = `${this.baseUrl}getAllgiftCard`;

    this.ajaxService.get(url).subscribe((data: any) => {
      if (data && data.response && Array.isArray(data.response)) {
        this.dataSource = new MatTableDataSource<GiftCardData>(data.response[0]);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      }
    });
  }
}

@Component({
  templateUrl: "create_gift_card.html",
})
export class create_gift_card implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public settings!: Settings;
  form: FormGroup;
  groupList: any[] = [];
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  location_name: string = "";
  amount: number = 0;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: MatTableDataSource<any>;

  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<create_gift_card>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.createForm();
    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
    this.angForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit() {
    // Initialize any necessary data
  }

  createForm() {
    // Add form initialization if needed
  }

  addevent(event: any): void {
    if (this.angForm.valid) {
      const amount = this.angForm.get('amount')?.value;
      const url = `${this.baseUrl}giftcard_req`;
      const payload = { amount: amount.toString() };
      
      this.ajaxService.post<any>(payload, url).subscribe(
        (response: any) => {
          if (response) {
            this.snackBar.open('Gift card created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open('Failed to create gift card. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        (error) => {
          this.snackBar.open('Error creating gift card. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    const url = `${this.baseUrl}getAllgiftCard`;

    this.ajaxService.get(url).subscribe((data: any) => {
      if (data && data.response) {
        this.dataSource = new MatTableDataSource<any>(data.response);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      }
    });
  }
}
