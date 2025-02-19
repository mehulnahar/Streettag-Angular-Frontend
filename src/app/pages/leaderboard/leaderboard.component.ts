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
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";

interface LeaderboardData {
  s_no: number;
  team_name: string;
  totalpoints: number;
  totalplayer: number;
}

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LeaderboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public newMail: boolean = false;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string = '';
  public form: FormGroup;

  public show_dialog: boolean = false;
  public button_name: string = "Show Login Form!";
  groupList: any[] = [];
  delresult: any;
  resData: any;
  allLocations: any[] = [];
  Location_name: string = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    "rank",
    "team_name",
    "total_points",
    "number_of_players",
  ];
  public dataSource: MatTableDataSource<LeaderboardData>;
  public dataSource2: LeaderboardData[] = [];
  public rank1: boolean = false;
  public rank2: boolean = false;
  public rank3: boolean = false;

  public dataSourceLocation: any[] = [];
  public dataSourceCircuit: any[] = [];
  public dataSourceLeaderboard: any[] = [];
  public dataSourceTeamDataAnalysis: any[] = [];

  public dailyMiles: number = 0;
  public weeklyMiles: number = 0;
  public monthlyMiles: number = 0;

  public location_id: string = '';
  public circuit_id: string = '';
  public location_name: string = "";
  public circuit_name: string = "";
  public spinner: boolean = false;
  public iframe: boolean = false;
  public iframeCode: string = "";

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
    this.dataSource = new MatTableDataSource<LeaderboardData>([]);
    this.getallLocation();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  getallConsents() {
    const url = `${this.baseUrl}getConsents`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<LeaderboardData>(data["response"]);
    });
  }

  getallLocation() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceLocation = data["response"];
    });
  }

  get_location_id(res: string): void {
    const url = `${this.baseUrl}getCircuitByLocation`;
    const data1 = {
      location_id: res,
    };

    this.circuit_id = "";
    this.circuit_name = "";

    if (data1.location_id === "") {
      return;
    }

    this.location_id = res;

    this.ajaxService.post(data1, url).subscribe((data: any) => {
      this.dataSourceCircuit = data["response"];
      this.dataSource2 = [];
    });
  }

  onSubmit(data: any) {
    this.spinner = true;
    this.iframe = true;

    const getUrl = window.location;
    const frameUrl =
      getUrl.protocol +
      "//" +
      getUrl.host +
      "/#/dynamiclead?circuit_name=" +
      data.circuit_name +
      "&location_name=" +
      data.location_name;

    this.iframeCode =
      '<iframe src="' + frameUrl + '" height="500" width="700"></iframe>';

    const url = `${this.baseUrl}getLeaderboardData`;

    this.ajaxService.post(data, url).subscribe((data: any) => {
      this.dataSourceLeaderboard = data["response"];
      this.spinner = false;
      this.dataSource2 = data["response"];
    });
  }


}
