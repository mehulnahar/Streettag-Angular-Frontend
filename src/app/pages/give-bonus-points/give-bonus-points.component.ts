import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";

import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

interface PlayerResponse {
  response: any[];
  status: string;
}

@Component({
  selector: "app-give-bonus-points",
  templateUrl: "./give-bonus-points.component.html",
  styleUrls: ["./give-bonus-points.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class GiveBonusPointsComponent implements OnInit {
	
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly baseUrl = environment.baseUrl;

  public myControl1 = new FormControl();
  options1: any[] = [];

  public myControl2 = new FormControl();
  options2: any[] = [];

  public myControl3 = new FormControl();
  options3: any[] = [];

  public filteredOptions1: Observable<any>;
  public filteredOptions2: Observable<any>;
  public filteredOptions3: Observable<any>;

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
  public dataSource: any;
  public dataSource2: any;
  public rank1: boolean = false;
  public rank2: boolean = false;
  public rank3: boolean = false;

  public team_namet: string = "";
  public player_namet: string = "";

  dataSourceLocation: any[] = [];
  dataSourceAllPlayers: any[] = [];
  dataSourceCircuit: any[] = [];
  dataSourcePlayers: any[] = [];
  dataSourcePlayersDetails: any[] = [];

  dataSourceLeaderboard: any[] = [];
  dataSourceTeamDataAnalysis: any[] = [];

  public dailyMiles: any;
  public weeklyMiles: any;
  public monthlyMiles: any;
  public points: string = "";
  public bonus_type: string = "2";
  public device_token: string = "";
  public device_type: string = "";

  public location_id: string = "";
  public circuit_id: string = "";
  public team_id: string = "";
  public team_name: string = "0";
  public player_id: string = "";
  public player_id2: string = "";
  public player_name: string = "";
  public player_email: string = "";
  public player_team: string = "";
  public spinner: any;

  public is_all: boolean = true;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    
    this.form = this.formBuilder.group({
      points: [''],
      reason: ['']
    });

    // Initialize Observables
    this.filteredOptions1 = new Observable<any>();
    this.filteredOptions2 = new Observable<any>();
    this.filteredOptions3 = new Observable<any>();

    this.getallLocation();
    this.getAllPlayers();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.loadInitialData();
  }

  private loadInitialData() {
    // Initialize your data loading here
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    this.sidenavOpen = window.innerWidth > 992;
  }

  getallLocation() {
    const url = `${this.baseUrl}getTeamAdmin`;

    this.ajaxService.get<PlayerResponse>(url).subscribe((data) => {
      this.dataSourceLocation = data.response;
      this.options3 = this.dataSourceLocation;

      this.filteredOptions3 = this.myControl3.valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          if (value === "") {
            this.getAllPlayers();
          } else {
            this.get_team_id(value);
          }
          return this._filterTeam(value);
        })
      );
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options1.filter((option: any) =>
      option.player_idd.toLowerCase().includes(filterValue)
    );
  }

  private _filterTeam(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options3.filter((option: any) =>
      option.team_namee.toLowerCase().includes(filterValue)
    );
  }

  getAllPlayers() {
    this.dataSourceAllPlayers = [];
    const url = `${this.baseUrl}getAllPlayersList`;

    this.ajaxService.get<PlayerResponse>(url).subscribe((data) => {
      this.dataSourceAllPlayers = data.response;
      this.options1 = this.dataSourceAllPlayers;

      this.filteredOptions1 = this.myControl1.valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          this.get_player_id(value);
          return this._filter(value);
        })
      );
    });
  }

  get_player_id(res: string): boolean {
    if (!res) {
      return false;
    }

    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    const data1 = { player_id: res };

    this.ajaxService.post<PlayerResponse>(data1, url).subscribe((data) => {
      this.dataSourcePlayersDetails = data.response;
      if (this.dataSourcePlayersDetails.length > 0) {
        const player = this.dataSourcePlayersDetails[0];
        this.player_name = player.fullname;
        this.player_email = player.email;
        this.player_team = player.team_name;
        this.device_token = player.device_token;
        this.device_type = player.device_type;
        this.circuit_id = player.circuit_id;
        this.location_id = player.location_id;
        this.team_id = player.team_id;
        this.player_id = player.player_id;
      }
    });

    return true;
  }

  get_team_id(res: string): boolean {
    if (res === "0") {
      this.resetPlayerFields();
      return false;
    }

    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    const data1 = { team_id: res };

    if (!data1.team_id) {
      return false;
    }

    this.ajaxService.post<PlayerResponse>(data1, url).subscribe((data) => {
      this.dataSourcePlayers = data.response;
      this.player_namet = "";
      this.options1 = this.dataSourcePlayers;

      this.filteredOptions1 = this.myControl1.valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          this.get_player_id(value);
          return this._filter(value);
        })
      );

      this.is_all = false;
    });

    return true;
  }

  onSubmit(data: any): boolean {
    if (this.form.valid) {
      const data2 = {
        player_id: this.player_id,
        points: data.points,
        bonus_type: this.bonus_type,
      };

      if (!this.validateSubmitData(data2)) {
        this.snackBar.open(
          "Please select player and/or Enter valid points",
          undefined,
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          }
        );
        return false;
      }

      const url = `${this.baseUrl}sendBonusPointNotificationNew`;
      data.player_id = this.player_id;

      this.ajaxService.post<PlayerResponse>(data, url).subscribe((response) => {
        this.resetForm();
        
        const message = response.status === "true" 
          ? "Points sent successfully" 
          : "Points not sent successfully";

        this.snackBar.open(message, undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "blue-snackbar",
        });
      });
    }
    return true;
  }

  private validateSubmitData(data: any): boolean {
    if (!data.player_id || !data.points) {
      return false;
    }
    
    const patt = /^[0-9]*$/;
    return patt.test(data.points);
  }

  private resetForm(): void {
    this.player_name = "";
    this.player_email = "";
    this.player_team = "";
    this.device_token = "";
    this.device_type = "";
    this.circuit_id = "";
    this.location_id = "";
    this.team_id = "";
    this.team_name = "0";
    this.player_id = "";
    this.player_id2 = "";
    this.points = "";
    this.bonus_type = "2";
    this.is_all = true;
    this.team_namet = "";
    this.player_namet = "";

    this.getallLocation();
    this.getAllPlayers();
  }

  private resetPlayerFields(): void {
    this.player_id = "";
    this.player_id2 = "";
    this.is_all = true;
  }
}
