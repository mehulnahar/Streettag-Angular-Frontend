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
  selector: "app-kingstone",
  templateUrl: "./kingstone.component.html",
  styleUrls: ["./kingstone.component.scss"],
  encapsulation: ViewEncapsulation.None,
  // providers: [ExcelService],
})




export class KingstoneComponent implements OnInit {
  public test = "";

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;

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
    "leaderboard",
    "team_name",
    "fullname",
    "player_id",
    "email",
    "password",
    "qr_code",
    //"action",
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallKingstone();
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
  openEditDialog(): void {
    alert("work under process...");
    // let dialogRef = this.dialog.open(DialogEditKingstone, {
    // 	data: { event }
    // });

    // dialogRef.afterClosed().subscribe(result => {

    // 	this.getallKingstone();
    // });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddKingstone, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallKingstone();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  public csv_url = "";

  // openBulkMessageDialog(): void {
  //   let dialogRef = this.dialog.open(DialogBulkKingstone, {
  //     data: { groups: this.groupList.result },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  //     //console.log(result);
  //     this.csv_url = result;
  //     //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')

  //     this.getallKingstone();
  //     this.toggle();
  //   });
  // }

  getallKingstone() {
    var url = `${this.baseUrl}getAllSchool`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
      if (data1["msg"] == "invalid format") {
        alert("invalid headings");
      }
    });
  }
}

@Component({
  templateUrl: "Kingstone-add-model.html",
})
export class DialogAddKingstone implements OnInit {
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

    this.getallKingstone();
    this.getallCircuits();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.dataSource.paginator = this.paginator;
  //   }, 1500);
  //   setTimeout(() => {
  //     this.dataSource.sort = this.sort;
  //   }, 3000);
  // }

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
  location_id = 27;
  circuit_id = 39;
  tag_image: any;
  public showMap = true;
  public tagLatings: any;
  public sponsorLatings: any;
  public spinner:Boolean = false;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  public dataSourceCircuits: any;
  private readonly baseUrl = environment.baseUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddKingstone>,
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


  getallCircuits() {
    var getdata = {};
    var url = `${this.baseUrl}getSchoolCircuits`;

    var data = {};
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceCircuits = data["response"];
    });
  }


  getallKingstone() {
    var url = `${this.baseUrl}getAllSchool`;

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
  //    password: ["", Validators.required],
    //  confirm_password: ["", [this.passValidator2]],
      referral_code: [""],
      postal_code: [""],
      date_of_birth: [""],
      team_name: ["", Validators.required],
      circuit_id : ['', Validators.required],
    });
  }

  blank() {
    this.angForm.patchValue({ confirm_password: "" });
  }

  onKey(event) {
    var res = event.target.value.toLowerCase();
    this.angForm.patchValue({ user_name: res });
  }

  onKey1(event) {
    var res = event.target.value.toLowerCase();
    this.angForm.patchValue({ email: res });
  }

  addevent() {
    if (this.angForm.status == "VALID") {
      this.spinner = true;

      var full_name1 = this.angForm.value.full_name;
          full_name1 = full_name1.replace("'", "`");
      var user_name1 = this.angForm.value.user_name;
          user_name1 = user_name1.replace("'", "`");    
      var email1 = this.angForm.value.email;
          email1 = email1.replace("'", "`");     
          var num = Math.floor(Math.random()*90000) + 10000;
          var password1 = "Street@Tag"+num;
          // password1 = password1.replace("'", "`");                       
      var team_name1 = this.angForm.value.team_name;
          team_name1 = team_name1.replace("'", "`");  

      var url = `${this.baseUrl}addKingstone`;
      var data1 = {
        full_name: full_name1,
        user_name: user_name1,
        email: email1,
        password: password1,
        referral_code: this.angForm.value.referral_code,
        team_name: team_name1,
        postal_code: this.angForm.value.postal_code,
        date_of_birth: this.angForm.value.date_of_birth,
        gender: this.gender,
        circuit_id: this.circuit_id,
        location_id: this.location_id,
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
         this.spinner = false;

        } else if (data1["status"] == "false1") {
          this.snackBar.open("User already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
         this.spinner = false;
        } else {
          this.snackBar.open("Kingstone already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
         this.spinner = false;
        }

        this.getallKingstone();

        this.dialogRef.close();
      });
    }
  }
}

@Component({
  //templateUrl: 'sponsor_edit_modal.component.html',
  templateUrl: "Kingstone-edit-model.html",
})
export class DialogEditKingstone {
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

    this.getallKingstone();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.dataSource.paginator = this.paginator;
  //   }, 1500);
  //   setTimeout(() => {
  //     this.dataSource.sort = this.sort;
  //   }, 3000);
  // }

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

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  private readonly baseUrl = environment.baseUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddKingstone>,
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

  getallKingstone() {
    var url = `${this.baseUrl}getAllSchool`;

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
      var url = `${this.baseUrl}editKingstone`;
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
          this.snackBar.open("Kingstone already exist", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        }
        this.getallKingstone();
        this.dialogRef.close();
      });
    }
  }
}

/*
@Component({
  templateUrl: "Kingstone-bulk_model.html",
})
export class DialogBulkKingstone implements OnInit {
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

    this.getallKingstone();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  @ViewChild("sidenav") sidenav: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    public dialogRef: MatDialogRef<DialogBulkKingstone>,
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
    this.excelService.exportAsExcelFile(this.data11, "unsaved-Kingstone");
  }

  getallKingstone() {
    var url = `${this.baseUrl}getAllSchool`;

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
    //console.log('*****************************');
    //console.log(this.csv_file)
    // //console.log(this.tag_image.split(";")[0]);

    //console.log('*****************************');
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
    }
    //alert(this.csv_file.split(";")[0]);
    if (this.csv_file.split(";")[0] == "data:text/csv") {
      //console.log('ok');
      //this.uploadCSV();
    } else {
      ////console.log('Please select csv format');
      this.snackBar.open("Please select csv format", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      //alert('please select CSV format');
      return false;
    }

    this.spinner = true;

    var url = `${this.baseUrl}bulkUpload`;
    var data1 = {
      csv_file: this.csv_file,
    };

    //this.dialogRef.close(this.csv_url);

    this.ajaxService.post(data1, url).subscribe((data1) => {
      ////console.log(data1['msg']);

      if (data1["msg"] == "invalid format") {
        alert("invalid headings");
      }
      if (data1["msg"] != "invalid format") {
        //console.log(data1);
        //this.csv_url = "data:application/vnd.ms-excel;base64," + data1['error_data'];
        this.csv_url2 = data1["error_data"];
        //console.log('********************');
        ////console.log(this.csv_url);
        //console.log('********************');
        //console.log('********************');
        //console.log(this.csv_url2);

        this.data11 = this.csv_url2;
        if (this.csv_url2.length != 0) {
          this.exportAsXLSX();
        }

        //console.log('********************');
        //window.location.href = this.csv_url;
        this.show_file_message = false;
        if (this.csv_url2.length != 0) {
          this.show_table = true;
          this.show_table2 = false;
          this.spinner = false;
        } else {
          this.show_table2 = true;
          this.show_table = false;
          this.spinner = false;
        }
      }
    });

    // if(this.show_file_message==true){

    // }
  }

  downloadCSV() {
    var url = `${this.baseUrl}downloadSample`;

    this.ajaxService.get(url).subscribe(() => {
      //console.log(data);
    });
  }
}
*/