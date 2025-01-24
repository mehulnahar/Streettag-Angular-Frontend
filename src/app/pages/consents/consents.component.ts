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

@Component({
  selector: "app-consents",
  templateUrl: "./consents.component.html",
  styleUrls: ["./consents.component.scss"],
  encapsulation: ViewEncapsulation.None,
 })
export class ConsentsComponent implements OnInit {
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
  public zoom: number = 7;
  public displayedColumns = [
    "serial_number",
    "fullname",
    "email",
    "created_at",
    "phone_number",
    "share_info",
  ];
  public dataSource: any;
  data: any = [];

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService,
    private excelService: ExcelService
  ) {
    this.settings = this.appSettings.settings;
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
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    // $('#spinner').show();

    // var thisone = this;
    //          setTimeout(function(){
    //           thisone.getMsggroups()
    //           thisone.getgroupList()
    //           thisone.getallConsents()
    //           thisone.viewDetail(this.glist);
    //      $('#spinner').hide();
    //     },2000);

    this.getallConsents();

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

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallConsents() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getConsents`;

    var data = {};

    //console.log(url);

    this.ajaxService.get(url).subscribe((data) => {
      this.data = data["response"];
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
    });
  }
  //////////////////delete Dialoge///////////////////
  // OpenDelete(id): void {

  //   //console.log("************:" + id)

  //   let dialogRef = this.dialog.open(DeletedialogBuilding, {
  //     data: { name: "" }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //     this.delresult = result;
  //     if (this.delresult == "1")
  //       this.deleteBuilding(id);
  //   });
  // }

  deleteBuilding(id) {
    //console.log("id:" + id)

    var getdata = {};
    var url = `${this.baseUrl}deleteBuilding`;
    var data = { id: id };

    //console.log("data 89889 : ", data)
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallConsents();
        ////console.log("result is:");

        ////console.log(this.resData);
        this.snackBar.open(" deleted Successfully!", null, {
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
