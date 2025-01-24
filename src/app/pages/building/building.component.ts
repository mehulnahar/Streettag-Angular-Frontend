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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

@Component({
  selector: "app-building",
  templateUrl: "./building.component.html",
  styleUrls: ["./building.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class BuildingComponent implements OnInit {
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
  public zoom: number = 7;
  public displayedColumns = ["id", "building_name", "edit" , "delete"];
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

    this.getallBuilding();

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

  // public viewDetail(mail){
  //   this.mail = this.mailboxService.getMail(mail.id);
  //   this.mails.forEach(m => m.selected = false);
  //   this.mail.selected = true;
  //   this.mail.unread = false;
  //   this.newMail = false;
  //   if(window.innerWidth <= 992){
  //     this.sidenav.close();
  //   }
  // }

  //////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    //console.log(event);

    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewBuilding, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallBuilding();
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      }, 3000);
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddBuilding, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallBuilding();
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      }, 3000);
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallBuilding() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getBuilding`;

    var data = {};

    //console.log(url);

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete ${data.building_name} building?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteBuilding(data.id);
      }
    });
  }

  deleteBuilding(id) {
    var url = `${this.baseUrl}deleteBuilding`;
    var data = { id: id };
 this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.getallBuilding();
        this.snackBar.open("Building Deleted Successfully!", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addbuilding-dialog.html",
})
export class DialogOverviewAddBuilding {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number;
  public lng: number;
  public zoom: number = 7;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  private readonly baseUrl = environment.baseUrl;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddBuilding>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
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

  getallBuilding() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getBuilding`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      building_name: ["", Validators.required],
      lat: ["", Validators.required],
      lng: ["", Validators.required],
    });
  }

  addevent() {
    if (this.building_name == "" || this.lat == null || this.lng == null) {
      this.snackBar.open("Please fill the details", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["blue-snackbar"],
      });
    }

    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      //console.log(data);

      var url = `${this.baseUrl}addBuilding`;
      var data1 = {
        building_name: this.building_name,
        lat: this.lat,
        lng: this.lng,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getallBuilding();
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
  templateUrl: "dialog-overview-building-dialog.html",
})
export class DialogOverviewBuilding {
  allLocations = [] as any;
  form: FormGroup;

  public lat = "";
  public lng = "";
  public building_name = "";
  public id = "";
  private readonly baseUrl = environment.baseUrl;

  public zoom: number = 7;
  public settings: Settings;
  resData = [] as any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewBuilding>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.building_name = this.data.event.building_name;
    this.lat = this.data.event.lat;
    this.lng = this.data.event.lng;
    this.id = this.data.event.id;

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
      building_name: ["", Validators.required],
      lat: ["", Validators.required],
      lng: ["", Validators.required],
    });
  }

  updateevent() {
    if (this.building_name == "" || this.lat == "" || this.lng == "") {
      this.snackBar.open("Please fill the details", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    }

    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editBuilding`;
      var data1 = {
        building_name: this.building_name,
        lat: this.lat,
        lng: this.lng,
        id: this.id,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)

        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });

        this.dialogRef.close();
      });
    }
  }

  closeDialog(group) {
    this.dialogRef.close(group);
  }
}
