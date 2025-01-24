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
import { environment } from "src/environments/environment";

// import {DeletedialogLocation} from '../../DeletedialogLocation/DeletedialogLocation.component';

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./Location.component.html",
  styleUrls: ["./Location.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class LocationComponent implements OnInit {
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
  public i = 0;

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
    "location_name",
    "created_at",
    "edit",
  ];
  public dataSource: any;

  lastelementData: any;

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

    this.getallLocations();

    this.form = this.formBuilder.group({
      to: ["", Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
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

  ////////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    //console.log(event);

    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewMessageDialogLocation, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallLocations();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogLocation, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallLocations();

      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallLocations() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getLocations`;

    var data = {};

    this.ajaxService.get(url).subscribe(
      (data) => {
        //dataSource = data['response'];
        this.dataSource = new MatTableDataSource<Element>(data["response"]);

        //console.log("all Locations:");
        //console.log(this.dataSource)

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
        }
      }
    );
  }
  ////////////////////delete Dialoge///////////////////
  OpenDelete(id): void {
    //console.log("************:" + id)

    let dialogRef = this.dialog.open(DeletedialogLocation, {
      data: { name: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.delresult = result;
      if (this.delresult == "1") this.deleteLocation(id);
    });
  }

  deleteLocation(Location_id) {
    //console.log("id:" + Location_id)

    var getdata = {};
    var url = `${this.baseUrl}deleteLocation`;
    var data = { location_id: Location_id };

    //console.log("data 89889 : ", data)
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallLocations();
        ////console.log("result is:");

        ////console.log(this.resData);
        this.snackBar.open("Location deleted Successfully!", null, {
          duration: 3000,
          verticalPosition: "top",
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
    // this. getLink();
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogLocation {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogLocation>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getLocations`;

    var data = {};

    this.ajaxService.get(url).subscribe(
      (data) => {
        //dataSource = data['response'];
        this.dataSource = new MatTableDataSource<Element>(data["response"]);
        //console.log("all Locations:");
        //console.log(this.dataSource)

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
        }
      }
    );
  }

  createForm() {
    this.angForm = this.fb.group({
      location_name: ["", Validators.required],
    });
  }

  addevent() {
    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      //console.log(data);

      var url = `${this.baseUrl}addLocation`;
      var data1 = {
        location_name: this.location_name,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getallLocations();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogLocation {
  allLocations = [] as any;
  form: FormGroup;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_name = "";
  location_name_old = "";
  location_id = "";

  public zoom: number = 7;
  public settings: Settings;
  resData = [] as any;
  private readonly baseUrl = environment.baseUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogLocation>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.location_name = this.data.event.location_name;
    this.location_name_old = this.data.event.location_name;
    this.location_id = this.data.event.id;

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.angForm = this.fb.group({
      location_name: ["", Validators.required],
    });
  }

  updateevent() {
    //console.log(this.angForm.status);

    //console.log("lastelementData yy uu ", this.location_name_old);

    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editLocation`;
      var data1 = {
        location_id: this.location_id,
        location_name: this.location_name,
        location_name_old: this.location_name_old,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)

        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
        });

        this.dialogRef.close();
      });
    }
  }

  closeDialog(group) {
    this.dialogRef.close(group);
  }
}

@Component({
  selector: "app-blank",
  templateUrl: "./DeletedialogLocation.dialog.html",
})
export class DeletedialogLocation {
  constructor(
    public dialogRef: MatDialogRef<DeletedialogLocation>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(x) {
    this.dialogRef.close(x);
  }
}
