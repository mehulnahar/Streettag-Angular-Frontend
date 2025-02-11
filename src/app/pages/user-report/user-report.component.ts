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
  
  import { FormControl } from "@angular/forms";
  import { startWith } from "rxjs/internal/operators/startWith";
  import { map } from "rxjs/internal/operators/map";
  import { Observable } from "rxjs/internal/Observable";
  import { environment } from "src/environments/environment";
  
  import { formatDate } from "@angular/common";
  import { DateAdapter } from "@angular/material/core";

  import * as moment from 'moment';
  import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
  import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
  import { E } from "@angular/cdk/keycodes";

  import { ExcelService } from "../../excel.service";

  interface PlayerOption {
    player_idd: string;
  }

  interface TeamOption {
    team_namee: string;
  }

  interface ApiResponse<T> {
    response: T;
    status?: string;
    msg?: string;
  }

  interface PlayerDetails {
    id: string;
    name: string;
    email: string;
    points: number;
  }

  
  @Component({
    selector: 'app-user-report',
    templateUrl: './user-report.component.html',
    styleUrls: ['./user-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })



  export class UserReportComponent implements OnInit {
  
    @ViewChild("sidenav", { static: false }) sidenav: any;
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    private readonly baseUrl = environment.baseUrl;
  
    public myControl1 = new FormControl();
    options1: PlayerOption[] = [];
  
    public myControl2 = new FormControl();
    options2: any = [];
  
    public myControl3 = new FormControl();
    options3: TeamOption[] = [];
    
    public myControl4 = new FormControl();
  
    public filteredOptions1!: Observable<any>;
    public filteredOptions2!: Observable<any>;
    public filteredOptions3!: Observable<any>;
  
    public settings: Settings;
    public sidenavOpen: boolean = true;
  
    public newMail!: boolean;
    public type: string = "all";
    public showSearch: boolean = false;
    public searchText!: string;
    public form!: FormGroup;
     d :any
    public show_dialog: boolean = false;
    public button_name: any = "Show Login Form!";
    
    groupList = [] as any;
    delresult: any;
    resData: any;
    allLocations = [] as any;
    
    public dataSource: any;
    public dataSource2: any;
    public rank1 = false;
    public rank2 = false;
    public rank3 = false;
  
    public team_namet = "";
    public player_namet = "";

    public spinner:Boolean = false;

    public isVailid:Boolean = true;
  
    constructor(
      public appSettings: AppSettings,
      public formBuilder: FormBuilder,
      public snackBar: MatSnackBar,
      public dialog: MatDialog,
      public router: Router,
      private ajaxService: AjaxService,
      private excelService: ExcelService,
      private dateAdapter: DateAdapter<Date>
    ) {
      this.dateAdapter.setLocale('en-GB');
      this.settings = this.appSettings.settings;
      this.getAllTeams();
      this.getAllPlayers();
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
  
    public dataSourceLocation: any;
    public dataSourceAllPlayers: any;
    public dataSourceCircuit: any;
    public dataSourcePlayers: any;
    public dataSourcePlayersDetails: any;
  
    public dataSourceLeaderboard: any;
    public dataSourceTeamDataAnalysis: any;
  
    public dailyMiles: any;
    public weeklyMiles: any;
    public monthlyMiles: any;
    public points = "";
    public bonus_type = "2";
    public device_token = "";
    public device_type = "";
  
    public location_id = "";
    public circuit_id = "";
    public team_id = "";
    //public location_name = '';
    public team_name = "0";
    public player_id = "";
    public player_id2 = "";
    public player_name = "";
    public player_email = "";
    public player_dob = "";
    public player_points = "";
    

    public player_team = "";
    // public spinner: any;
  
    public is_all = true;

    dwData: any = [];
  
    getAllTeams(): void {
      const url = `${this.baseUrl}getTeamAdmin`;
  
      this.ajaxService.get<ApiResponse<TeamOption[]>>(url).subscribe({
        next: (data) => {
          this.dataSourceLocation = data.response;
          this.options3 = this.dataSourceLocation;
  
          this.filteredOptions3 = this.myControl3.valueChanges.pipe(
            startWith(""),
            map((value) => {
              if (value === "") {
                this.getAllPlayers();
              } else {
                this.get_team_id(value || "");
              }
              return this._filterTeam(value || "");
            })
          );
        },
        error: (error) => {
          console.error('Error fetching teams:', error);
          this.snackBar.open('Error fetching teams', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }
  
    private _filter(value: string): PlayerOption[] {
      const filterValue = value.toLowerCase();
  
      return this.options1.filter((option: PlayerOption) =>
        option.player_idd.toLowerCase().includes(filterValue)
      );
    }
  
    private _filterTeam(value: string): TeamOption[] {
      const filterValue = value.toLowerCase();
  
      return this.options3.filter((option: TeamOption) =>
        option.team_namee.toLowerCase().includes(filterValue)
      );
    }
  

    getAllPlayers(): void {
      this.dataSourceAllPlayers = [];
      const url = `${this.baseUrl}getAllPlayersList`;
  
      this.ajaxService.get<ApiResponse<PlayerOption[]>>(url).subscribe({
        next: (data) => {
          this.dataSourceAllPlayers = data.response;
          this.options1 = this.dataSourceAllPlayers;
  
          this.filteredOptions1 = this.myControl1.valueChanges.pipe(
            startWith(""),
            map((value) => {
              this.get_player_id(value || "");
              return this._filter(value || "");
            })
          );
        },
        error: (error) => {
          console.error('Error fetching players:', error);
          this.snackBar.open('Error fetching players', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }
  
    get_player_id(res: string): void {
      this.points = "";
      this.player_name = "";
      this.player_email = "";
      this.player_dob = "";
      this.player_points = "";
      this.player_team = "";
      
      const url = `${this.baseUrl}getPlayerDetailsAdmin`;
      const data1 = {
        player_id: res,
      };
  
      if (data1.player_id === "") {
        this.isVailid = true;
        return;
      }
  
      this.ajaxService.post<ApiResponse<any>>(data1, url).subscribe({
        next: (data) => {
          this.dataSourcePlayersDetails = data.response;
  
          if (this.dataSourcePlayersDetails && this.dataSourcePlayersDetails.length > 0) {
        this.player_name = this.dataSourcePlayersDetails[0].fullname;
        this.player_email = this.dataSourcePlayersDetails[0].email;
        this.player_dob = this.dataSourcePlayersDetails[0].date_of_birth;
        this.player_points = this.dataSourcePlayersDetails[0].score_points;
        this.player_team = this.dataSourcePlayersDetails[0].team_name;
        this.device_token = this.dataSourcePlayersDetails[0].device_token;
        this.device_type = this.dataSourcePlayersDetails[0].device_type;
        this.circuit_id = this.dataSourcePlayersDetails[0].circuit_id;
        this.location_id = this.dataSourcePlayersDetails[0].location_id;
        this.team_id = this.dataSourcePlayersDetails[0].team_id;
        this.player_id = this.dataSourcePlayersDetails[0].player_id;
        this.isVailid = false;
          }
        },
        error: (error) => {
          console.error('Error fetching player details:', error);
          this.snackBar.open('Error fetching player details', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }
  
    get_team_id(res: string): void {
      this.player_name = "";
      this.player_email = "";
      this.player_dob = "";
      this.player_points = "";
      this.player_team = "";
      this.player_id = "";
      this.player_id2 = "";
      this.points = "";
  
      if (res === "0") {
        this.player_id = "";
        this.player_id2 = "";
        this.is_all = true;
        return;
      }
  
      this.dataSourcePlayers = [];
      const url = `${this.baseUrl}getPlayerByTeamAdmin`;
      const data1 = {
        team_id: res,
      };
  
      if (data1.team_id === "") {
        return;
      }
  
      this.ajaxService.post<ApiResponse<any>>(data1, url).subscribe({
        next: (data) => {
          this.dataSourcePlayers = data.response;
        this.player_namet = "";
        this.options1 = this.dataSourcePlayers;
  
        this.filteredOptions1 = this.myControl1.valueChanges.pipe(
          startWith(""),
          map((value) => {
              this.get_player_id(value || "");
              return this._filter(value || "");
          })
        );
  
        this.is_all = false;
        },
        error: (error) => {
          console.error('Error fetching team players:', error);
          this.snackBar.open('Error fetching team players', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }

    dwStepsReport(data: any, report: any, player: any){

      // let buff = new Buffer(player, 'base64');  
      // player = buff.toString('ascii');      

      this.excelService.exportAsExcelFileN(data, player+" "+report+" report ");
    }      


    getPlayerTagsDetails(): void {
      if (!this.player_id) {
        this.snackBar.open('Please select a player first', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }

      const url = `${this.baseUrl}getPlayerTagsDataAdmin`;
      const data1 = { 
        player_id: this.player_id  // player_id is already base64 encoded
      };

      this.ajaxService.post<ApiResponse<PlayerDetails[]>>(data1, url).subscribe({
        next: (data) => {
          this.dataSourcePlayersDetails = data.response;
          this.dwStepsReport(this.dataSourcePlayersDetails, 'tags', this.player_id);
        },
        error: (error) => {
          console.error('Error fetching player tags:', error);
          this.snackBar.open('Error fetching player tags', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }  
    
    
    getPlayerStepsDetails(): void {
      if (!this.player_id) {
        this.snackBar.open('Please select a player first', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }

      const url = `${this.baseUrl}getPlayerStepsDataAdmin`;
      const data1 = { 
        player_id: this.player_id  // player_id is already base64 encoded
      };

      this.ajaxService.post<ApiResponse<PlayerDetails[]>>(data1, url).subscribe({
        next: (data) => {
          this.dataSourcePlayersDetails = data.response;
          this.dwStepsReport(this.dataSourcePlayersDetails, 'steps', this.player_id);
        },
        error: (error) => {
          console.error('Error fetching player steps:', error);
          this.snackBar.open('Error fetching player steps', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }    

    
    getPlayerPecodesDetails(): void {
      if (!this.player_id) {
        this.snackBar.open('Please select a player first', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }

      const url = `${this.baseUrl}getPlayerPecodeDataAdmin`;
      const data1 = { 
        player_id: this.player_id  // player_id is already base64 encoded
      };

      this.ajaxService.post<ApiResponse<PlayerDetails[]>>(data1, url).subscribe({
        next: (data) => {
          this.dataSourcePlayersDetails = data.response;
          console.log(data.response, '------------------x---------------');
          this.dwStepsReport(this.dataSourcePlayersDetails, 'pecode', this.player_id);
        },
        error: (error) => {
          console.error('Error fetching player pecodes:', error);
          this.snackBar.open('Error fetching player pecodes', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }      
  
  }
  