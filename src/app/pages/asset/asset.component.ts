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

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./asset.component.html",
  styleUrls: ["./asset.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class AssetComponent implements OnInit {
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
  asset_name = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    "serial_number",
    "asset_name",
    "category",
    "st_coin",
    "action",
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

    this.getallAssets();
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
    let dialogRef = this.dialog.open(DialogEditAsset, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallAssets();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddAsset, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallAssets();

      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallAssets() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getallAssets`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);

      //console.log("all Locations:");
      //console.log(this.dataSource)

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ////////////////////delete Dialoge///////////////////
  OpenDelete(id): void {
    //console.log("************:" + id)

    let dialogRef = this.dialog.open(DeleteAsset, {
      data: { name: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.delresult = result;
      if (this.delresult == "1") this.deleteAsset(id);
    });
  }

  deleteAsset(asset_id) {
    var getdata = {};
    var url = `${this.baseUrl}deleteAsset`;
    var data = { asset_id: asset_id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallAssets();

        // this.snackBar.open('Asset deleted Successfully!', null, {
        //   duration: 3000,
        //   verticalPosition: 'top'
        // });

        this.snackBar.open(this.resData.msg, null, {
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
  selector: "dialog-editAsset",
  templateUrl: "dialog-editAsset.html",
})
export class DialogEditAsset {
  allLocations = [] as any;
  form: FormGroup;

  public lat: number = 45.42153;
  public lng: number = -75.697193;

  asset_name = "";
  asset_name_old = "";

  asset_id = "";
  st_coin = "";
  category_id = "";

  public zoom: number = 7;
  public settings: Settings;
  resData = [] as any;

  public dataSourceCategory: any;
  private readonly baseUrl = environment.baseUrl;
  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEditAsset>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    this.getAssetsCategory();

    this.asset_name = this.data.event.asset_name;
    this.asset_name_old = this.data.event.asset_name;
    //this.st_coin = this.data.event.st_coin;
    this.asset_id = this.data.event.id;
    this.category_id = this.data.event.category_id;

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAssetsCategory() {
    var getdata = {};
    var url = `${this.baseUrl}getAssetsCategory`;
    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceCategory = data["response"];
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      asset_name: ["", Validators.required],
      //st_coin: ['', Validators.required],
      category_id: ["", Validators.required],
    });
  }

  updateevent() {
    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editAsset`;
      var data1 = {
        asset_id: this.asset_id,
        asset_name: this.asset_name,
        asset_name_old: this.asset_name_old,
        //"st_coin" : this.st_coin,
        category_id: this.category_id,
      };

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;

        console.log(this.resData);
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
  selector: "dialog-deleteAsset",
  templateUrl: "./dialog-deleteAsset.html",
})
export class DeleteAsset {
  constructor(
    public dialogRef: MatDialogRef<DeleteAsset>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(x) {
    this.dialogRef.close(x);
  }
}

// ////////////////////// for add //////////////////////////////////////////

@Component({
  selector: "dialog-add-asset",
  templateUrl: "dialog-add-asset.html",
})
export class DialogAddAsset {
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

  asset_name = "";
  category_id = "";

  public displayedColumns = ["serialno", "asset_name", "date", "action"];
  public dataSource: any;

  public dataSourceCategory: any;
  private readonly baseUrl = environment.baseUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddAsset>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.getAssetsCategory();
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

  getAssetsCategory() {
    var getdata = {};
    var url = `${this.baseUrl}getAssetsCategory`;
    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceCategory = data["response"];
    });
  }

  getallAssets() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getallAssets`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log("all Locations:");
      //console.log(this.dataSource)

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      asset_name: ["", Validators.required],
      category_id: ["", Validators.required],
    });
  }

  addevent() {
    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      //console.log(data);

      var url = `${this.baseUrl}addAsset`;
      var data1 = {
        asset_name: this.asset_name,
        category_id: this.category_id,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getallAssets();
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
