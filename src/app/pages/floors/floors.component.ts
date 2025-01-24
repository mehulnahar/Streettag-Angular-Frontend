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
import { pluck } from "rxjs/operators/pluck";
import { Observable } from "rxjs/observable";

@Component({
  selector: "app-floors",
  templateUrl: "./floors.component.html",
  styleUrls: ["./floors.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class FloorsComponent implements OnInit {
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
  public displayedColumns = ["id", "floor_name", "building_name", "edit","delete"];
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

    this.getallFloors();

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

  ////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    //console.log(event);

    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewFloor, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
    
      this.getallFloors();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddFloor, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog()

      this.getallFloors();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallFloors() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getFloors`;

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
    const message = `Are you sure you want to delete ${data.floor_name} Floor?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteFloor(data.id);
      }
    });
  }

  deleteFloor(id) {
    var url = `${this.baseUrl}deleteFloors`;
    var data = { id: id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.getallFloors();
        this.snackBar.open(" deleted Successfully!", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
    //this. getLink();
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addfloor-dialog.html",
})
export class DialogOverviewAddFloor {
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
  floor_name = "";
  building_id = "";
  public dataSourceBuilding:Observable<any>;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  private readonly baseUrl = environment.baseUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddFloor>,
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

    this.getallBuilding();
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallFloors() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getBuilding`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getallBuilding() {
    const url = `${this.baseUrl}getBuilding`;
    this.dataSourceBuilding = this.ajaxService.get(url).pipe(pluck("response"));
  }

  createForm() {
    this.angForm = this.fb.group({
      floor_name: ["", Validators.required],
      building_id: ["", Validators.required],
    });
  }

  addevent() {
    if (this.floor_name == "" || this.building_id == "") {
      this.snackBar.open("Please fill the details", null, {
        duration: 3000,
        verticalPosition: "top",
      });
    }

    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      //console.log(data);

      var url = `${this.baseUrl}addFloors`;
      var data1 = {
        floor_name: this.floor_name,
        building_id: this.building_id,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getallFloors();
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
  templateUrl: "dialog-overview-floor-dialog.html",
})
export class DialogOverviewFloor {
  allLocations = [] as any;
  form: FormGroup;

  public lat = "";
  public lng = "";
  public building_name = "";
  public id = "";
  public dataSourceBuilding:Observable<any>;
  public floor_name = "";
  public building_id = "";

  selectedValue: string;

  private readonly baseUrl = environment.baseUrl;

  public zoom: number = 7;
  public settings: Settings;
  resData = [] as any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewFloor>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.floor_name = this.data.event.floor_name;
    this.building_id = this.data.event.building_id;
    this.id = this.data.event.id;

    this.getallBuilding();

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
      floor_name: ["", Validators.required],
      building_id: ["", Validators.required],
    });
  }

  getallBuilding() {
   const url = `${this.baseUrl}getBuilding`;
   this.dataSourceBuilding = this.ajaxService.get(url).pipe(pluck("response"));
  }

  updateevent() {
    if (this.floor_name == "" || this.building_id == "") {
      this.snackBar.open("Please fill the details", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    }

    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editFloors`;
      var data1 = {
        id: this.id,
        floor_name: this.floor_name,
        building_id: this.building_id,
      };
      //console.log("request parameter isdfsdfsdfsd:")
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


