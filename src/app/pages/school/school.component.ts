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
import { ExcelService } from "../../excel.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-school",
  templateUrl: "./school.component.html",
  styleUrls: ["./school.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolComponent implements OnInit {
  public test = "";

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  public newMail: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;

  public show_dialog: boolean = false;
  public button_name: any = "Show Login Form!";
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = "";
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
  public dataSource: any;

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
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallSchool();
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

  ////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    let dialogRef = this.dialog.open(DialogEditSchool, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallSchool();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddSchool, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallSchool();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  public csv_url = "";

  openBulkMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogBulkSchool, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      //console.log(result);
      this.csv_url = result;
      //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')

      this.getallSchool();
      this.toggle();
    });
  }

  getallSchool() {
    var url = `${this.baseUrl}getSchool`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteSponsor(id) {
    var url = `${this.baseUrl}deleteSponsor`;
    var data = { sponsor_id: id };

    this.ajaxService.post(data, url).subscribe((data) => {
      this.resData = data;
      this.getallSchool();

      this.snackBar.open(" deleted Successfully!", null, {
        duration: 3000,
        verticalPosition: "top",
      });
    });
  }

  public csv_file;
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.csv_file = reader.result;
    //console.log('*****************************');
    // //console.log(this.tag_image)
    // //console.log(this.tag_image.split(";")[0]);
    if (this.csv_file.split(";")[0] == "data:application/vnd.ms-excel") {
      //console.log('ok');
      this.uploadCSV();
    } else {
      //console.log('Please select csv format');
      alert("please select CSV format");
    }
    //console.log('*****************************');
  }

  uploadCSV() {
    var url = `${this.baseUrl}test`;
    var data1 = {
      csv_file: this.csv_file,
    };

    this.ajaxService.post(data1, url).subscribe((data1) => {
      ////console.log(data1['msg']);
      if (data1["msg"] == "invalid format") {
        alert("invalid headings");
      }
      if (data1["msg"] != "invalid format") {
        //console.log(data1);
      }
    });
  }
}

@Component({
  templateUrl: "school-add-model.html",
})
export class DialogAddSchool implements OnInit {
  public sidenavOpen: boolean = true;

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallSchool();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number = 22.69310334966885;
  public lng: number = 75.8820695508789;
  public zoom: number = 12;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  tag_image: any;
  public showMap = true;
  public tagLatings: any;
  public sponsorLatings: any;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  private readonly baseUrl = environment.baseUrl;
  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddSchool>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallSchool() {
    var url = `${this.baseUrl}getSchool`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);

      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    });
  }

  checkPasswords(control: FormGroup) {
    let pass = control.get("password");
    let confirm_password = control.get("confirm_password");

    return pass && confirm_password && pass.value != confirm_password.value
      ? { misMatch: true }
      : null;
  }

  passValidator2(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get("password"); // magic is this
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === "") {
          return {
            isError: true,
          };
        }
      }
    }

    return null;
  }

  public gender = "male";

  createForm() {
    this.angForm = this.fb.group({
      full_name: ["", Validators.required],
      user_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirm_password: ["", [this.passValidator2]],
      referral_code: [""],
      postal_code: [""],
      date_of_birth: [""],
      team_name: ["", Validators.required],
    });
  }

  blank() {
    this.angForm.patchValue({ confirm_password: "" });
  }

  onKey(event) {
    var res = event.target.value.toLowerCase();
    this.angForm.patchValue({ user_name: res });
  }

  addevent() {
    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}addSchool`;
      var data1 = {
        full_name: this.angForm.value.full_name,
        user_name: this.angForm.value.user_name,
        email: this.angForm.value.email,
        password: this.angForm.value.password,
        referral_code: this.angForm.value.referral_code,
        team_name: this.angForm.value.team_name,
        postal_code: this.angForm.value.postal_code,
        date_of_birth: this.angForm.value.date_of_birth,
        gender: this.gender,
      };

      //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
      //console.log(data1);
      //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

      this.ajaxService.post(data1, url).subscribe((data1) => {
        if (data1["status"] == "true") {
          this.snackBar.open("successfully added", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "blue-snackbar",
          });
        } else if (data1["status"] == "false1") {
          this.snackBar.open("User already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        } else {
          this.snackBar.open("School already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        }

        this.getallSchool();

        this.dialogRef.close();
      });
    }
  }
}

@Component({
  //templateUrl: 'sponsor_edit_modal.component.html',
  templateUrl: "school-edit-model.html",
})
export class DialogEditSchool {
  public sidenavOpen: boolean = true;

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallSchool();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number = 22.69310334966885;
  public lng: number = 75.8820695508789;
  public zoom: number = 12;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  tag_image: any;
  public showMap = true;
  public tagLatings: any;
  public sponsorLatings: any;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddSchool>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    //console.log('**********************');
    //console.log(this.data);
    //console.log('**********************');
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallSchool() {
    var url = `${this.baseUrl}getSchool`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
    });
  }
  checkPasswords(control: FormGroup) {
    let pass = control.get("password");
    let confirm_password = control.get("confirm_password");
    return pass && confirm_password && pass.value != confirm_password.value
      ? { misMatch: true }
      : null;
  }
  passValidator2(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;
      const passControl = control.root.get("password"); // magic is this
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === "") {
          return {
            isError: true,
          };
        }
      }
    }
    return null;
  }
  public gender = this.data.event.gender;
  createForm() {
    this.angForm = this.fb.group({
      full_name: [this.data.event.fullname, Validators.required],
      user_name: [this.data.event.player_id, Validators.required],
      email: [this.data.event.email, [Validators.required, Validators.email]],
      password: [this.data.event.password, Validators.required],
      confirm_password: [this.data.event.password, [this.passValidator2]],
      referral_code: [this.data.event.referrel_code],
      postal_code: [this.data.event.postal_code],
      date_of_birth: [this.data.event.date_of_birth],
      team_name: [this.data.event.team_name, Validators.required],
    });
  }
  blank() {
    this.angForm.patchValue({ confirm_password: "" });
  }
  onKey(event) {
    var res = event.target.value.toLowerCase();
    this.angForm.patchValue({ user_name: res });
  }
  updateevent() {
    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editSchool`;
      var data1 = {
        full_name: this.angForm.value.full_name,
        user_name: this.angForm.value.user_name,
        email: this.angForm.value.email,
        password: this.angForm.value.password,
        referral_code: this.angForm.value.referral_code,
        team_name: this.angForm.value.team_name,
        postal_code: this.angForm.value.postal_code,
        date_of_birth: this.angForm.value.date_of_birth,
        gender: this.gender,
        tb_player_id: this.data.event.tb_player_id,
        tb_team_id: this.data.event.tb_team_id,
      };
      if (data1.date_of_birth == null) {
        data1.date_of_birth = "";
      }
      //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
      //console.log(data1);
      //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
      this.ajaxService.post(data1, url).subscribe((data1) => {
        if (data1["status"] == "true") {
          this.snackBar.open("successfully Updated", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "blue-snackbar",
          });
        } else if (data1["status"] == "false1") {
          this.snackBar.open("User already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        } else {
          this.snackBar.open("School already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        }
        this.getallSchool();
        this.dialogRef.close();
      });
    }
  }
}

@Component({
  templateUrl: "school-bulk_model.html",
})
export class DialogBulkSchool implements OnInit {
  public sidenavOpen: boolean = true;

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallSchool();
  }

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number = 22.69310334966885;
  public lng: number = 75.8820695508789;
  public zoom: number = 12;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  tag_image: any;
  public showMap = true;
  public tagLatings: any;
  public sponsorLatings: any;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  data11: any = [];
  private readonly baseUrl = environment.baseUrl;
  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogBulkSchool>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private excelService: ExcelService
  ) {}
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data11, "unsaved-school");
  }

  getallSchool() {
    var url = `${this.baseUrl}getSchool`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);

      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    });
  }

  public csv_file = "";
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.csv_file = reader.result;
  }

  public csv_url = "";
  public csv_url2 = "";
  public show_file_message = false;
  public show_table = false;
  public show_table2 = false;
  public spinner = false;
  uploadCSV() {
    this.show_file_message = true;

    if (this.csv_file == "") {
      //alert('please select file');
      this.snackBar.open("Please select file", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      return false;
    } else {
      this.snackBar.open("Please select csv format", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      return false;
    }
  }
}
