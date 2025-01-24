import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
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

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class LeaderboardComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
    "rank",
    "team_name",
    "total_points",
    "number_of_players",
  ];
  public dataSource: any;
  public dataSource2: any;
  public rank1 = false;
  public rank2 = false;
  public rank3 = false;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.getallLocation();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.dataSource.paginator = this.paginator;
  //   }, 1500);
  //   setTimeout(() => {
  //     this.dataSource.sort = this.sort;
  //   }, 3000);
  // }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    //this.getallConsents()
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  getallConsents() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getConsents`;

    var data = {};
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
     // this.dataSource.paginator = this.paginator;
    });
  }

  public dataSourceLocation: any;
  public dataSourceCircuit: any;
  public dataSourceLeaderboard: any;
  public dataSourceTeamDataAnalysis: any;

  public dailyMiles: any;
  public weeklyMiles: any;
  public monthlyMiles: any;

  public location_id: any;
  public circuit_id: any;
  public location_name = "";
  public circuit_name = "";
  public spinner: any;
  public iframe: any;
  public iframeCode = "";

  getallLocation() {
    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
     });
  }

  get_location_id(res) {
    var url = `${this.baseUrl}getCircuitByLocation`;

    var data1 = {
      location_id: res,
    };

    this.circuit_id = "";
    this.circuit_name = "";

    if (data1.location_id == "") {
      return false;
    }

    this.location_id = res;

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.dataSourceCircuit = data["response"];

      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');
      //console.log(this.dataSourceCircuit);
      this.dataSource2 = [];
      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');
    });
  }

  onSubmit(data) {
    this.spinner = true;

    //console.log(data);
    this.spinner = true;

    this.iframe = true;

    var getUrl = window.location;

    var frameUrl =
      getUrl.protocol +
      "//" +
      getUrl.host +
      "/#/dynamiclead?circuit_name=" +
      data.circuit_name +
      "&location_name=" +
      data.location_name;

    this.iframeCode =
      '<iframe src="' + frameUrl + '" height="500" width="700"></iframe>';

    var url = `${this.baseUrl}getLeaderboardData`;

    this.ajaxService.post(data, url).subscribe((data) => {
      this.dataSourceLeaderboard = data["response"];

      this.spinner = false;

      ////console.log(data['response']);

      this.dataSource2 = data["response"];
      //console.log(this.dataSource2);

      // //console.log('LLLLLLLLLLLLLLLLLLL');
      // ////console.log(this.dataSource2);

      // if (typeof this.dataSource2 !== 'undefined' && this.dataSource2.length > 0) {

      //   if (this.dataSource2[0].s_no != 'undefined' && this.dataSource2[0].s_no != '' && this.dataSource2[0].s_no != null) {
      //    this.rank1 = true;
      //    //console.log(this.rank1);
      //   }

      //   if(this.dataSource2[1].s_no != 'undefined' && this.dataSource2[0].s_no != '' && this.dataSource2[0].s_no != null){
      //     this.rank2 = true;
      //     //console.log(this.rank2);
      //   }

      // }
      // //console.log('LLLLLLLLLLLLLLLLLLL');

      ////console.log(this.dataSource2);

      // if (typeof this.dataSource2 !== 'undefined' && this.dataSource2.length > 0) {

      //   if(typeof this.dataSource2[0].s_no !== 'undefined'){
      //     //console.log('rank1');
      //     this.rank1 = true;
      //     //console.log(this.rank1);
      //   }

      //   if(typeof this.dataSource2[1].s_no !== 'undefined' || this.dataSource2[1].s_no !==null){
      //     //console.log('rank2');
      //     this.rank2 = true;
      //     //console.log(this.rank2);
      //   }

      // }

      // this.dataSource = new MatTableDataSource<Element>(data['response']);
      // this.dataSource.paginator = this.paginator;
    });
  }
}
