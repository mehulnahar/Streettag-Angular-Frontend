import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";

import { startWith, map, debounceTime, distinctUntilChanged, switchMap, takeUntil, catchError } from "rxjs/operators";
import { Observable, Subject, of } from "rxjs";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class GiveBonusPointsComponent implements OnInit, OnDestroy {
	
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

  public filteredOptions1: Observable<any> = new Observable<any>();
  public filteredOptions2: Observable<any> = new Observable<any>();
  public filteredOptions3: Observable<any> = new Observable<any>();

  public settings: Settings;
  public sidenavOpen: boolean = true;

  public newMail: boolean = false;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string = '';
  public form: FormGroup = new FormGroup({});

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

  private destroy$ = new Subject<void>();
  private searchTeam$ = new Subject<string>();
  private searchPlayer$ = new Subject<string>();
  private readonly MAX_ITEMS = 30; // Limit items for better performance

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService,
    private cdr: ChangeDetectorRef
  ) {
    this.settings = this.appSettings.settings;
    this.initForm();
    this.initializeSearchSubscriptions();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      device_token: [''],
      device_type: [''],
      location_id: [''],
      circuit_id: [''],
      team_id: [''],
      player_email: [''],
      points: [''],
      bonus_type: ['2'],
    });
  }

  private initializeSearchSubscriptions() {
    // Team search subscription
    this.searchTeam$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term) {
          return this.getAllPlayers();
        }
        return this.getTeamPlayers(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // Player search subscription
    this.searchPlayer$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term) return of([]);
        return this.getPlayerDetails(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // Initialize autocomplete observables
    this.initializeAutocomplete();
  }

  private initializeAutocomplete() {
    // Team autocomplete
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = typeof value === 'string' ? value : value?.team_namee || '';
        if (typeof value === 'object' && value) {
          this.get_team_id(value.team_id);
        } else {
          this.searchTeam$.next(searchTerm);
        }
        return this._filterTeam(searchTerm);
      })
    );

    // Player autocomplete
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchTerm = typeof value === 'string' ? value : value?.player_idd || '';
        if (typeof value === 'object' && value) {
          this.get_player_id(value.player_idd);
        } else {
          this.searchPlayer$.next(searchTerm);
        }
        return this._filter(searchTerm);
      })
    );
  }

  private _filter(value: string): any[] {
    if (!value) return this.options1.slice(0, this.MAX_ITEMS);
    
    const filterValue = value.toLowerCase();
    return this.options1
      .filter(option => option.player_idd.toLowerCase().includes(filterValue))
      .slice(0, this.MAX_ITEMS);
  }

  private _filterTeam(value: string): any[] {
    if (!value) return this.options3.slice(0, this.MAX_ITEMS);
    
    const filterValue = value.toLowerCase();
    return this.options3
      .filter(option => option.team_namee.toLowerCase().includes(filterValue))
      .slice(0, this.MAX_ITEMS);
  }

  private getTeamPlayers(teamId: string): Observable<any> {
    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    return this.ajaxService.post<PlayerResponse>({ team_id: teamId }, url).pipe(
      map(data => {
        this.dataSourcePlayers = data.response;
        this.options1 = this.dataSourcePlayers;
        this.is_all = false;
        this.cdr.detectChanges();
        return data;
      }),
      catchError(error => {
        console.error('Error fetching team players:', error);
        return of([]);
      })
    );
  }

  private getPlayerDetails(playerId: string): Observable<any> {
    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    return this.ajaxService.post<PlayerResponse>({ player_id: playerId }, url).pipe(
      map(data => {
        if (data.response.length > 0) {
          const player = data.response[0];
          this.updatePlayerDetails(player);
        }
        return data;
      }),
      catchError(error => {
        console.error('Error fetching player details:', error);
        return of([]);
      })
    );
  }

  private updatePlayerDetails(player: any) {
    this.player_name = player.fullname;
    this.player_email = player.email;
    this.player_team = player.team_name;
    this.player_id = player.player_id;
    
    this.form.patchValue({
      device_token: player.device_token,
      device_type: player.device_type,
      circuit_id: player.circuit_id,
      location_id: player.location_id,
      team_id: player.team_id,
      player_email: player.email
    });

    this.cdr.detectChanges();
  }

  getAllPlayers(): Observable<any> {
    const url = `${this.baseUrl}getAllPlayersList`;
    return this.ajaxService.get<PlayerResponse>(url).pipe(
      map(data => {
        this.dataSourceAllPlayers = data.response;
        this.options1 = this.dataSourceAllPlayers;
        this.cdr.detectChanges();
        return data;
      }),
      catchError(error => {
        console.error('Error fetching all players:', error);
        return of([]);
      })
    );
  }

  getallLocation() {
    const url = `${this.baseUrl}getTeamAdmin`;
    this.ajaxService.get<PlayerResponse>(url).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.dataSourceLocation = data.response;
        this.options3 = this.dataSourceLocation;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
      }
    });
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getallLocation();
    this.getAllPlayers().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    this.sidenavOpen = window.innerWidth > 992;
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
        
        // Update form controls with player data
        this.form.patchValue({
          device_token: player.device_token,
          device_type: player.device_type,
          circuit_id: player.circuit_id,
          location_id: player.location_id,
          team_id: player.team_id,
          player_email: player.email
        });

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
    this.form.reset({
      bonus_type: '2'
    });
    
    this.player_name = "";
    this.player_email = "";
    this.player_team = "";
    this.team_name = "0";
    this.player_id = "";
    this.player_id2 = "";
    this.is_all = true;
    this.team_namet = "";
    this.player_namet = "";

    this.getallLocation();
    this.getAllPlayers().subscribe();
  }

  private resetPlayerFields(): void {
    this.player_id = "";
    this.player_id2 = "";
    this.is_all = true;
  }
}
