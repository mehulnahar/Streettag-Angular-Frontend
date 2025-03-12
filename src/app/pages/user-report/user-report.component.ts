import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    HostListener,
    Inject,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef
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
  import { startWith, map, debounceTime, distinctUntilChanged, switchMap, takeUntil, catchError } from 'rxjs/operators';
  import { Observable, Subject, of } from 'rxjs';
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
    changeDetection: ChangeDetectionStrategy.OnPush
  })



  export class UserReportComponent implements OnInit, OnDestroy {
  
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
  
    private destroy$ = new Subject<void>();
    private readonly MAX_ITEMS = 30; // Limit items for better performance
  
    constructor(
      public appSettings: AppSettings,
      public formBuilder: FormBuilder,
      public snackBar: MatSnackBar,
      public dialog: MatDialog,
      public router: Router,
      private ajaxService: AjaxService,
      private excelService: ExcelService,
      private dateAdapter: DateAdapter<Date>,
      private cdr: ChangeDetectorRef
    ) {
      this.dateAdapter.setLocale('en-GB');
      this.settings = this.appSettings.settings;
      this.initializeFormControls();
    }
  
    private initializeFormControls() {
      // Initialize team search with debounce
      this.myControl3.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          if (!value) {
            this.options3 = [];
            return new Observable(observer => {
              observer.next(null);
              observer.complete();
            });
          }
          // Only load team data when user types
          return this.ajaxService.get<ApiResponse<TeamOption[]>>(`${this.baseUrl}getTeamAdmin`).pipe(
            map(data => {
              this.dataSourceLocation = data.response;
              this.options3 = this.dataSourceLocation;
              this.filteredOptions3 = of(this._filterTeam(value));
              this.get_team_id(value);
              this.cdr.detectChanges();
              return null;
            }),
            catchError(error => {
              console.error('Error fetching teams:', error);
              this.snackBar.open('Error fetching teams', 'Close', {
                duration: 3000,
                verticalPosition: 'top'
              });
              return of(null);
            })
          );
        })
      ).subscribe();

      // Initialize player search with debounce - only for filtering suggestions
      this.myControl1.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value => {
        if (!value) {
          this.resetPlayerFields();
          return;
        }
        
        // Only update the filtered options, don't fetch player details yet
        if (this.is_all) {
          this.getAllPlayers().subscribe();
        }
        this.filteredOptions1 = of(this._filter(value));
      });
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
  
      this.ajaxService.get<ApiResponse<TeamOption[]>>(url).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (data) => {
          this.dataSourceLocation = data.response;
          this.options3 = this.dataSourceLocation;
  
          this.filteredOptions3 = this.myControl3.valueChanges.pipe(
            startWith(""),
            map((value) => this._filterTeam(value || ""))
          );
          this.cdr.detectChanges();
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
      if (!value) return this.options1.slice(0, this.MAX_ITEMS);
      
      const filterValue = value.toLowerCase();
      return this.options1
        .filter((option: PlayerOption) =>
          option.player_idd.toLowerCase().includes(filterValue)
        )
        .slice(0, this.MAX_ITEMS);
    }
  
    private _filterTeam(value: string): TeamOption[] {
      if (!value) return this.options3.slice(0, this.MAX_ITEMS);
      
      const filterValue = value.toLowerCase();
      return this.options3
        .filter((option: TeamOption) =>
          option.team_namee.toLowerCase().includes(filterValue)
        )
        .slice(0, this.MAX_ITEMS);
    }
  
    getAllPlayers(): Observable<any> {
      const url = `${this.baseUrl}getAllPlayersList`;
  
      return this.ajaxService.get<ApiResponse<PlayerOption[]>>(url).pipe(
        map(data => {
          this.dataSourceAllPlayers = data.response;
          this.options1 = this.dataSourceAllPlayers;
  
          this.filteredOptions1 = this.myControl1.valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value || ""))
          );
          this.cdr.detectChanges();
          return data;
        }),
        catchError(error => {
          console.error('Error fetching players:', error);
          this.snackBar.open('Error fetching players', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
          return [];
        })
      );
    }
  
    get_player_id(res: string): void {
      if (!res) {
        this.resetPlayerFields();
        return;
      }

      const url = `${this.baseUrl}getPlayerDetailsAdmin`;
      const data1 = { player_id: res };
  
      this.ajaxService.post<ApiResponse<any>>(data1, url).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (data) => {
          this.dataSourcePlayersDetails = data.response;
  
          if (this.dataSourcePlayersDetails?.length > 0) {
            const player = this.dataSourcePlayersDetails[0];
            this.updatePlayerDetails(player);
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
  
    private updatePlayerDetails(player: any): void {
      this.player_name = player.fullname;
      this.player_email = player.email;
      this.player_dob = player.date_of_birth;
      this.player_points = player.score_points;
      this.player_team = player.team_name;
      this.device_token = player.device_token;
      this.device_type = player.device_type;
      this.circuit_id = player.circuit_id;
      this.location_id = player.location_id;
      this.team_id = player.team_id;
      this.player_id = player.player_id;
      this.isVailid = false;
      this.cdr.detectChanges();
    }
  
    private resetPlayerFields(): void {
      this.points = "";
      this.player_name = "";
      this.player_email = "";
      this.player_dob = "";
      this.player_points = "";
      this.player_team = "";
      this.isVailid = true;
      this.cdr.detectChanges();
    }
  
    get_team_id(res: string): void {
      this.resetPlayerFields();
  
      if (res === "0") {
        this.player_id = "";
        this.player_id2 = "";
        this.is_all = true;
        return;
      }
  
      const url = `${this.baseUrl}getPlayerByTeamAdmin`;
      const data1 = { team_id: res };
  
      if (!data1.team_id) return;
  
      this.ajaxService.post<ApiResponse<any>>(data1, url).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (data) => {
          this.dataSourcePlayers = data.response;
          this.player_namet = "";
          this.options1 = this.dataSourcePlayers;
  
          this.filteredOptions1 = this.myControl1.valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value || ""))
          );
  
          this.is_all = false;
          this.cdr.detectChanges();
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
      if (!data || !Array.isArray(data) || data.length === 0) {
        this.snackBar.open('No data available to download', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }

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
          if (!data.response || data.response.length === 0) {
            this.snackBar.open('No pecode data found for this player', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
            return;
          }
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
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }

    trackByTeam(index: number, item: TeamOption): string {
      return item.team_namee;
    }

    trackByPlayer(index: number, item: PlayerOption): string {
      return item.player_idd;
    }

    onFocus(field: string): void {
      // Only handle focus-related UI updates if needed
      this.cdr.detectChanges();
    }

    // Add new method to handle option selection
    onPlayerOptionSelected(event: any): void {
      const selectedPlayerId = event.option.value;
      if (selectedPlayerId) {
        this.get_player_id(selectedPlayerId);
      }
    }
  }
  