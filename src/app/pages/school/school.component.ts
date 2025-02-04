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
  ValidationErrors,
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
import { ExcelService } from "../../excel.service";
import { environment } from "src/environments/environment";

interface SchoolData {
  id: number;
  serial_number: number;
  team_name: string;
  player_id: string;
  email: string;
  qr_code_path: string;
}

interface ApiResponse<T> {
  response: T[];
  status: string;
  msg: string;
}

@Component({
  selector: "app-school",
  templateUrl: "./school.component.html",
  styleUrls: ["./school.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolComponent implements OnInit {
  public test = "";

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  public newMail: boolean = false;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string = '';
  public form!: FormGroup;

  public show_dialog: boolean = false;
  public button_name: string = "Show Login Form!";
  groupList: any[] = [];
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  Location_name: string = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 15;
  public displayedColumns = [
    "serial_number",
    "team_name",
    "player_id",
    "email",
    "qr_code",
    "edit",
  ];
  public dataSource!: MatTableDataSource<SchoolData>;

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

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, 1500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getallSchool();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    this.sidenavOpen = window.innerWidth > 992;
  }

  public getMails() {
    switch (this.type) {
      default:
        break;
    }
  }

  openEditDialog(event: any): void {
    let dialogRef = this.dialog.open(DialogEditSchool, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallSchool();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddSchool, {
      data: { groups: this.groupList },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallSchool();
      this.toggle();
    });
  }

  toggle() {
    this.show_dialog = !this.show_dialog;
  }

  public csv_url: string = "";

  openBulkMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogBulkSchool, {
      data: { groups: this.groupList },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.csv_url = result;
      this.getallSchool();
      this.toggle();
    });
  }

  getallSchool() {
    const url = `${this.baseUrl}getSchool`;

    this.ajaxService.get<ApiResponse<SchoolData>>(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<SchoolData>(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteSponsor(id: number) {
    const url = `${this.baseUrl}deleteSponsor`;
    const data = { sponsor_id: id };

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
      this.resData = response;
      this.getallSchool();

      this.snackBar.open("Deleted Successfully!", undefined, {
        duration: 3000,
        verticalPosition: "top",
      });
    });
  }

  public csv_file: string = '';
  handleInputChange(e: any) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: any) {
    const reader = e.target;
    this.csv_file = reader.result;
    if (this.csv_file.split(";")[0] === "data:application/vnd.ms-excel") {
      this.uploadCSV();
    } else {
      alert("please select CSV format");
    }
  }

  uploadCSV() {
    const url = `${this.baseUrl}test`;
    const data = {
      csv_file: this.csv_file,
    };

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
      if (response.msg === "invalid format") {
        alert("invalid headings");
      }
    });
  }
}

@Component({
  templateUrl: "school-add-model.html",
})
export class DialogAddSchool implements OnInit {
  angForm: FormGroup = this.createForm();
  gender: string = 'male';
  
  constructor(
    public dialogRef: MatDialogRef<DialogAddSchool>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onKey(event: any): void {
    // Handle key event
  }

  blank(): void {
    // Handle blank event
  }

  createForm(): FormGroup {
    return this.fb.group({
      team_name: ['', Validators.required],
      full_name: ['', Validators.required],
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      postal_code: [''],
      date_of_birth: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    const password = g.get('password');
    const confirmPassword = g.get('confirm_password');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { isError: true };
  }

  addevent(): void {
    if (this.angForm.valid) {
      const url = `${environment.baseUrl}addSchool`;
      const formData = {
        ...this.angForm.value,
        gender: this.gender
      };

      this.ajaxService.post<ApiResponse<any>>(formData, url).subscribe({
        next: (response) => {
          if (response.status === "true") {
            this.snackBar.open("School Added Successfully!", undefined, {
              duration: 3000,
              verticalPosition: "top",
            });
            this.dialogRef.close();
          } else {
            this.snackBar.open(response.msg || "Error adding school", undefined, {
              duration: 3000,
              verticalPosition: "top",
            });
          }
        },
        error: (error) => {
          this.snackBar.open("Error adding school", undefined, {
            duration: 3000,
            verticalPosition: "top",
          });
        }
      });
    }
  }
}

@Component({
  templateUrl: "./school-edit-model.html",
})
export class DialogEditSchool implements OnInit {
  angForm: FormGroup = this.createForm();
  gender: string = 'male';
  
  constructor(
    public dialogRef: MatDialogRef<DialogEditSchool>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setFormValues();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(): FormGroup {
    return this.fb.group({
      team_name: ['', Validators.required],
      full_name: ['', Validators.required],
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],  // Made optional for edit
      confirm_password: [''],  // Made optional for edit
      postal_code: [''],
      date_of_birth: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  setFormValues(): void {
    if (this.data && this.data.event) {
      console.log('Raw API Data:', this.data.event);

      // Map the API response fields to form fields
      const formData = {
        team_name: this.data.event.team_name || '',
        full_name: this.data.event.fullname || '',  // Changed to match API's 'fullname' field
        user_name: this.data.event.player_id || '',
        email: this.data.event.email || '',
        postal_code: this.data.event.postal_code || '',
        date_of_birth: this.data.event.date_of_birth ? new Date(this.data.event.date_of_birth) : null,
        password: this.data.event.password || '',  // Include password from API
        confirm_password: this.data.event.password || ''  // Set same as password for edit mode
      };

      console.log('Mapped Form Data:', formData);

      // Update form values
      this.angForm.patchValue(formData);
      
      // Set gender
      this.gender = this.data.event.gender || 'male';

      // Make username field readonly
      const userNameControl = this.angForm.get('user_name');
      if (userNameControl) {
        userNameControl.disable();
      }

      // Make password fields optional
      const passwordControl = this.angForm.get('password');
      const confirmPasswordControl = this.angForm.get('confirm_password');
      if (passwordControl && confirmPasswordControl) {
        // Remove required validators but keep password match validator
        passwordControl.setValidators(null);
        confirmPasswordControl.setValidators(null);
        
        // Update validation status
        passwordControl.updateValueAndValidity();
        confirmPasswordControl.updateValueAndValidity();
      }
    } else {
      console.warn('No data available for form population');
    }
  }

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    const password = g.get('password');
    const confirmPassword = g.get('confirm_password');
    
    // Only validate if both fields have values
    if (password && confirmPassword && password.value && confirmPassword.value) {
      return password.value === confirmPassword.value ? null : { isError: true };
    }
    return null;  // Don't validate if fields are empty
  }

  updateevent(): void {
    if (this.angForm.valid) {
      const formData = this.angForm.getRawValue(); // Gets values including disabled fields
      const url = `${environment.baseUrl}updateSchool`;
      
      // Prepare data for API
      const data: any = {
        id: this.data.event.id,
        team_name: formData.team_name,
        fullname: formData.full_name,  // Changed to match API's 'fullname' field
        player_id: formData.user_name,
        email: formData.email,
        postal_code: formData.postal_code || '',
        gender: this.gender,
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null
      };

      // Only include password fields if they have values
      if (formData.password && formData.password.trim()) {
        data.password = formData.password;
        data.confirm_password = formData.confirm_password;
      }

      console.log('Data being sent to API:', data);

      this.ajaxService.post<ApiResponse<any>>(data, url).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          if (response.status === "true") {
            this.snackBar.open("School Updated Successfully!", undefined, {
              duration: 3000,
              verticalPosition: "top",
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open(response.msg || "Error updating school", undefined, {
              duration: 3000,
              verticalPosition: "top",
            });
          }
        },
        error: (error) => {
          console.error('Update error:', error);
          this.snackBar.open("Error updating school", undefined, {
            duration: 3000,
            verticalPosition: "top",
          });
        }
      });
    }
  }
}

@Component({
  templateUrl: "./school-bulk_model.html",
})
export class DialogBulkSchool implements OnInit {
  csv_file: string = '';
  uploadedData: any[] = [];
  spinner: boolean = false;
  show_table: boolean = false;
  show_table2: boolean = false;
  csv_url2: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogBulkSchool>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleInputChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }

  _handleReaderLoaded(event: any) {
    const reader = event.target;
    this.csv_file = reader.result;
    if (this.csv_file.split(";")[0] === "data:application/vnd.ms-excel") {
      this.parseCSV(this.csv_file);
    } else {
      this.snackBar.open("Please select a CSV file", undefined, {
        duration: 3000,
        verticalPosition: "top",
      });
    }
  }

  parseCSV(csvData: string) {
    // Add CSV parsing logic here
    this.uploadedData = []; // Parse CSV and populate this array
  }

  uploadCSV(): void {
    if (!this.csv_file) return;

    this.spinner = true;
    const url = `${environment.baseUrl}bulkUploadSchool`;
    const data = { csv_file: this.csv_file };

    this.ajaxService.post<ApiResponse<any>>(data, url).subscribe({
      next: (response) => {
        this.spinner = false;
        if (response.status === "true") {
          this.show_table2 = true;
          this.show_table = false;
          this.snackBar.open("Schools uploaded successfully!", undefined, {
            duration: 3000,
            verticalPosition: "top",
          });
          this.dialogRef.close();
        } else {
          this.show_table = true;
          this.show_table2 = false;
          this.csv_url2 = response.response || [];
          this.snackBar.open(response.msg || "Error uploading schools", undefined, {
            duration: 3000,
            verticalPosition: "top",
          });
        }
      },
      error: (error) => {
        this.spinner = false;
        this.snackBar.open("Error uploading schools", undefined, {
          duration: 3000,
          verticalPosition: "top",
        });
      }
    });
  }
}
