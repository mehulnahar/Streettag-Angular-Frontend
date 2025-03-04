import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
// import { ExcelService } from "../../excel.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-cardqr",
  templateUrl: "./cardqr.component.html",
  styleUrls: ["./cardqr.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CardqrComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public showSearch: boolean = false;
  public searchText: string = '';
  public form: FormGroup;

  public show_dialog: boolean = false;
  public button_name: string = "Show Login Form!";
  groupList: any[] = [];
  delresult: any;
  resData: any;

  public displayedColumns = [
    "serial_number",
    "circuit_name",
    "team_name",
    "fullname",
    "player_id",
    "email",
    "password",
    "qr_code_path",
  ];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getSchoolQRs();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    this.sidenavOpen = window.innerWidth > 992;
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogCardqr, {
      data: { groups: this.groupList },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getSchoolQRs();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getSchoolQRs() {
    const url = `${this.baseUrl}getAllSchool`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}

@Component({
  templateUrl: "cardqr-add-model.html",
})
export class DialogCardqr implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public spinner: boolean = false;
  public dataSourceSchools: any;
  private readonly baseUrl = environment.baseUrl;
  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCardqr>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public appSettings: AppSettings
  ) {
    this.settings = this.appSettings.settings;
    this.angForm = this.createForm();
  }

  ngOnInit() {
    this.getSchoolCircuits();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    this.sidenavOpen = window.innerWidth > 992;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSchoolCircuits() {
    const url = `${this.baseUrl}getSchoolCircuits`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceSchools = data.response;
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      circuit_name: ['', Validators.required],
      team_name: ['', Validators.required],
      fullname: ['', Validators.required],
      player_id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      postal_code: [''],
      gender: ['', Validators.required],
      date_of_birth: ['']
    });
  }

  addevent(): void {
    if (this.angForm.valid) {
      this.spinner = true;
      const url = `${this.baseUrl}addKingstone`;
      const formData = {
        circuit_id: this.angForm.get('circuit_name')?.value,
        team_name: this.angForm.get('team_name')?.value,
        full_name: this.angForm.get('fullname')?.value,
        user_name: this.angForm.get('player_id')?.value,
        email: this.angForm.get('email')?.value,
        postal_code: this.angForm.get('postal_code')?.value || "",
        gender: this.angForm.get('gender')?.value,
        date_of_birth: this.angForm.get('date_of_birth')?.value || "",
        password: `Street@Tag${Math.floor(Math.random() * 90000) + 10000}`,
        referral_code: "",
        location_id: 27,
      };

      this.ajaxService.post(formData, url).subscribe({
        next: (response: any) => {
          this.spinner = false;
          if (response.status === "true") {
            this.snackBar.open("School added successfully!", undefined, {
              duration: 3000,
              verticalPosition: "top"
            });
            this.dialogRef.close();
          } else if (response.status === "false1") {
            this.snackBar.open("User already exists!", undefined, {
              duration: 3000,
              verticalPosition: "top"
            });
          } else {
            this.snackBar.open(response.msg || "Error adding school", undefined, {
              duration: 3000,
              verticalPosition: "top"
            });
          }
        },
        error: () => {
          this.spinner = false;
          this.snackBar.open("Error adding school", undefined, {
            duration: 3000,
            verticalPosition: "top"
          });
        }
      });
    }
  }
}

