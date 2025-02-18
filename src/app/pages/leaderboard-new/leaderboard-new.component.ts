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

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  playerCount: number;
  averageScore: number;
  totalScore: number;
}

@Component({
  selector: "app-leaderboard-new",
  templateUrl: "./leaderboard-new.component.html",
  styleUrls: ["./leaderboard-new.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LeaderboardNewComponent implements OnInit {
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
  public dataSource: MatTableDataSource<LeaderboardEntry>;
  public dataSource2: LeaderboardEntry[] = [];
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

  public leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      teamName: 'Succulents W',
      playerCount: 3,
      averageScore: 1352283,
      totalScore: 4056850
    },
    {
      rank: 2,
      teamName: 'St Christophers School Oxford',
      playerCount: 1,
      averageScore: 1295835,
      totalScore: 1295835
    },
    {
      rank: 3,
      teamName: 'You and Me',
      playerCount: 2,
      averageScore: 1248190,
      totalScore: 2496380
    },
    {
      rank: 4,
      teamName: 'All By Myself',
      playerCount: 1,
      averageScore: 837140,
      totalScore: 837140
    },
    {
      rank: 5,
      teamName: 'JDteam',
      playerCount: 1,
      averageScore: 800145,
      totalScore: 800145
    },
    {
      rank: 6,
      teamName: 'Chang',
      playerCount: 1,
      averageScore: 528790,
      totalScore: 528790
    }
  ];

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
    this.dataSource = new MatTableDataSource<LeaderboardEntry>(this.leaderboardData);
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
      this.dataSource = new MatTableDataSource<LeaderboardEntry>(data["response"]);
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

    // Reset both circuit name and id
    this.circuit_id = "";
    this.circuit_name = "";

    if (!res) {
      return;
    }

    this.location_id = res;

    this.ajaxService.post(data1, url).subscribe((data: any) => {
      if (data && data.response) {
        this.dataSourceCircuit = data.response;
        // If there's only one circuit, auto-select it
        if (this.dataSourceCircuit.length === 1) {
          this.circuit_id = this.dataSourceCircuit[0].id;
          this.circuit_name = this.dataSourceCircuit[0].circuit_name;
        }
      }
    });
  }

  private mapApiResponseToLeaderboardEntry(apiResponse: any[]): LeaderboardEntry[] {
    return apiResponse.map((item, index) => ({
      rank: index + 1,
      teamName: item.team_name,
      playerCount: item.total_players,
      averageScore: item.avg_points,
      totalScore: item.total_points
    }));
  }

  onSubmit(data: any) {
    this.spinner = true;

    const url = `${this.baseUrl}getAvgLeaderboardData`;
    const requestData = {
      location_id: this.location_id,
      circuit_id: this.circuit_id
    };

    console.log('Request Data:', requestData);

    this.ajaxService.post(requestData, url).subscribe((data: any) => {
      this.spinner = false;
      if (data && data.response) {
        this.leaderboardData = this.mapApiResponseToLeaderboardEntry(data.response);
      }
    }, error => {
      this.spinner = false;
      console.error('Error fetching leaderboard data:', error);
    });
  }

  getCardColor(rank: number): string {
    const position = (rank - 1) % 6;
    switch (position) {
      case 0: return 'purple';
      case 1: return 'navy';
      case 2: return 'green';
      case 3: return 'magenta';
      case 4: return 'teal';
      case 5: return 'pink';
      default: return 'purple';
    }
  }
} 