import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { startWith, map, debounceTime, switchMap, catchError, distinctUntilChanged } from "rxjs/operators";
import { Observable, of, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { formatDate } from "@angular/common";
import { DateAdapter } from "@angular/material/core";

interface ApiResponse {
  response: any[];
  status: string;
  message: string;
}

interface PlayerDetails {
  fullname: string;
  email: string;
  date_of_birth: string;
  team_name: string;
  device_token: string;
  device_type: string;
  circuit_id: string;
  location_id: string;
  team_id: string;
  player_id: string;
  player_idd: string;
}

interface TeamDetails {
  team_id: string;
  team_name: string;
  team_namee: string;
}

@Component({
  selector: 'app-dob-change',
  templateUrl: './dob-change.component.html',
  styleUrls: ['./dob-change.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DobChangeComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav") sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly baseUrl = environment.baseUrl;

  public myControl1 = new FormControl('');
  public myControl2 = new FormControl('');
  public myControl3 = new FormControl('');
  public myControl4 = new FormControl<Date | null>(null, Validators.required);
  
  options1: PlayerDetails[] = [];
  options2: any[] = [];
  options3: TeamDetails[] = [];
  
  public filteredOptions1!: Observable<PlayerDetails[]>;
  public filteredOptions2!: Observable<any>;
  public filteredOptions3!: Observable<TeamDetails[]>;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public showSearch: boolean = false;
  public searchText: string = '';
  public searchForm: FormGroup;
  public d: Date | null = null;

  public dataSourceLocation: TeamDetails[] = [];
  public dataSourceAllPlayers: PlayerDetails[] = [];
  public dataSourcePlayers: PlayerDetails[] = [];
  public dataSourcePlayersDetails: PlayerDetails[] = [];
  
  public points: string = '';
  public bonus_type: string = '2';
  public device_token: string = '';
  public device_type: string = '';
  public location_id: string = '';
  public circuit_id: string = '';
  public team_id: string = '';
  public team_name: string = '0';
  public player_id: string = '';
  public player_id2: string = '';
  public player_name: string = '';
  public player_email: string = '';
  public player_dob: string = '';
  public player_team: string = '';
  public team_namet: string = '';
  public player_namet: string = '';
  public is_all: boolean = true;

  private destroy$ = new Subject<void>();
  private searchTerms = new Subject<string>();
  public isSearching = false;
  private allPlayersCache: PlayerDetails[] = [];
  public isPlayersLoaded = false;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.settings = this.appSettings.settings;
    
    this.searchForm = this.formBuilder.group({
      device_token: [''],
      device_type: [''],
      location_id: [''],
      circuit_id: [''],
      team_id: [''],
      player_email: [''],
      player_id: [''],
      date_of_birth: ['', Validators.required]
    });

    this.myControl4.valueChanges.subscribe(value => {
      this.d = value;
    });

    this.setupAutoComplete();
    this.getallLocation();
    this.loadPlayersInBackground();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    this.sidenavOpen = window.innerWidth > 992;
  }

  private handleApiResponse<T>(response: unknown): ApiResponse {
    try {
      if (!response) {
        throw new Error('Empty response');
      }

      // Handle string responses (sometimes API returns stringified JSON)
      if (typeof response === 'string') {
        try {
          response = JSON.parse(response);
        } catch (e) {
          console.error('Failed to parse response string:', e);
          throw new Error('Invalid response format');
        }
      }

      // Handle the case where response might be wrapped
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        
        // If the response is wrapped in a data property
        if (responseObj.data && typeof responseObj.data === 'object') {
          response = responseObj.data;
        }

        // Check if it has the required properties
        if ('response' in responseObj) {
          return {
            response: Array.isArray(responseObj.response) ? responseObj.response : [],
            status: String(responseObj.status || 'false'),
            message: String(responseObj.message || '')
          };
        }
      }

      throw new Error('Invalid response structure');
    } catch (error) {
      console.error('API Response handling error:', error);
      return {
        response: [],
        status: 'false',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private setupAutoComplete(): void {
    // Setup team autocomplete with debounce and client-side filtering
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        if (!value || value.length < 3) {
          return [];
        }
        this.isSearching = true;
        const result = this._filterTeam(value);
        this.isSearching = false;
        return result;
      })
    );

    // Setup player autocomplete with debounce and client-side filtering
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        if (!value || value.length < 3) {
          return [];
        }
        
        this.isSearching = true;
        const result = this._filterPlayers(value);
        this.isSearching = false;
        return result;
      })
    );
  }

  onPlayerIdFocus(): void {
    // Don't show all options when field is focused
    // Only show results when user types at least 3 characters
  }

  // Client-side filtering with pagination
  private _filterPlayers(value: string): PlayerDetails[] {
    if (!this.isPlayersLoaded || !value || value.length < 3) {
      return [];
    }
    
    const filterValue = value.toLowerCase();
    
    // Filter players and limit to 20 results
    return this.allPlayersCache
      .filter(player => {
        try {
          const playerIdMatch = player.player_idd ? 
            window.atob(player.player_idd).toLowerCase().includes(filterValue) : false;
          const nameMatch = player.fullname ? 
            window.atob(player.fullname).toLowerCase().includes(filterValue) : false;
          return playerIdMatch || nameMatch;
        } catch (error) {
          console.error('Error decoding player data:', error);
          return false;
        }
      })
      .slice(0, 20); // Limit to 20 results
  }

  getallLocation() {
    this.isSearching = true;
    const url = `${this.baseUrl}getTeamAdmin`;
    this.ajaxService.get(url).subscribe({
      next: (response) => {
        try {
          const data = this.handleApiResponse(response);
          if (Array.isArray(data.response)) {
            this.dataSourceLocation = data.response;
            this.options3 = this.dataSourceLocation;
          } else {
            console.error('Invalid location data format:', data);
            this.snackBar.open("Invalid data format received", undefined, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: "red-snackbar",
            });
          }
        } catch (error) {
          console.error('Error processing location data:', error);
          this.snackBar.open("Error processing data", undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        } finally {
          this.isSearching = false;
        }
      },
      error: (error) => {
        console.error('Failed to fetch locations:', error);
        this.snackBar.open("Failed to fetch locations", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
        this.isSearching = false;
      }
    });
  }

  loadPlayersInBackground() {
    this.isSearching = true;
    const url = `${this.baseUrl}getAllPlayersList`;
    this.ajaxService.get(url).subscribe({
      next: (response) => {
        try {
          const data = this.handleApiResponse(response);
          if (Array.isArray(data.response)) {
            this.allPlayersCache = data.response.map(item => ({
              ...item,
              player_idd: item.player_id || '',
              fullname: item.fullname || '',
              email: item.email || '',
              date_of_birth: item.date_of_birth || '',
              team_name: item.team_name || '',
              device_token: item.device_token || '',
              device_type: item.device_type || '',
              circuit_id: item.circuit_id || '',
              location_id: item.location_id || '',
              team_id: item.team_id || '',
              player_id: item.player_id || ''
            }));
            this.isPlayersLoaded = true;
          }
        } catch (error) {
          console.error('Error processing player data:', error);
        } finally {
          this.isSearching = false;
        }
      },
      error: (error) => {
        console.error('Failed to fetch players:', error);
        this.isSearching = false;
      }
    });
  }

  get_player_id(res: string): void {
    if (!res) return;

    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    const data = { player_id: res };

    this.ajaxService.post<ApiResponse>(data, url).subscribe({
      next: (response) => {
        const data = this.handleApiResponse(response);
        if (data.response && data.response.length > 0) {
          const details = data.response[0];
          this.player_name = details.fullname;
          this.player_email = details.email;
          this.player_dob = details.date_of_birth;
          this.player_team = details.team_name;
          this.device_token = details.device_token;
          this.device_type = details.device_type;
          this.circuit_id = details.circuit_id;
          this.location_id = details.location_id;
          this.team_id = details.team_id;
          this.player_id = details.player_id;
        }
      },
      error: (error) => {
        console.error('Failed to fetch player details:', error);
        this.snackBar.open('Failed to fetch player details', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    });
  }

  get_team_id(res: string): void {
    this.resetPlayerData();
    
    if (res === '0') {
      this.is_all = true;
      return;
    }

    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    const data = { team_id: res };

    this.isSearching = true;
    this.ajaxService.post<ApiResponse>(data, url).subscribe({
      next: (response) => {
        const data = this.handleApiResponse(response);
        if (data.response) {
          this.dataSourcePlayers = data.response;
          this.options1 = this.dataSourcePlayers;
          this.is_all = false;
          
          // Update the filteredOptions1 to use the team-specific players
          this.filteredOptions1 = this.myControl1.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            map(value => {
              if (!value || value.length < 3) {
                return [];
              }
              return this._filter(value);
            })
          );
        }
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Failed to fetch team players:', error);
        this.snackBar.open('Failed to fetch team players', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.isSearching = false;
      }
    });
  }

  private resetPlayerData(): void {
    this.player_name = "";
    this.player_email = "";
	this.player_dob = "";
    this.player_team = "";
    this.player_id = "";
    this.player_id2 = "";
    this.points = "";
    this.searchForm.reset();
  }

  private _filter(value: string): PlayerDetails[] {
    const filterValue = value.toLowerCase();
    return this.options1.filter(option => {
      const playerIdMatch = option.player_idd ? window.atob(option.player_idd).toLowerCase().includes(filterValue) : false;
      const nameMatch = option.fullname ? window.atob(option.fullname).toLowerCase().includes(filterValue) : false;
      return playerIdMatch || nameMatch;
    });
  }

  private _filterTeam(value: string): TeamDetails[] {
    if (!value || value.length < 3) {
      return [];
    }
    
    const filterValue = value.toLowerCase();
    return this.options3
      .filter(option => {
        try {
          const teamName = option.team_name ? window.atob(option.team_name).toLowerCase() : '';
          return teamName.includes(filterValue);
        } catch (error) {
          console.error('Error decoding team name:', error);
          return false;
        }
      })
      .slice(0, 20); // Limit to 20 results
  }

  onSubmit(formValue: any): void {
    if (!this.player_id || !this.d) {
      this.snackBar.open(
        "Please select player and/or Enter valid Date Of Birth",
        undefined,
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        }
      );
      return;
    }

    const nd = new Date(this.d).toLocaleString('en-GB');
    const nnd = nd.split(',');
    const formData = {
      circuit_id: this.circuit_id,
      date_of_birth: nnd[0],
      device_token: this.device_token,
      device_type: this.device_type,
      location_id: this.location_id,
      player_email: this.player_email,
      player_id: this.player_id,
      team_id: this.team_id
    };

    const url = `${this.baseUrl}updatedob`;

    this.ajaxService.post(formData, url).subscribe({
      next: (response) => {
        const data = this.handleApiResponse(response);
        this.resetPlayerData();
        this.team_name = "0";
        this.bonus_type = "2";
        this.is_all = true;
        this.team_namet = "";
        this.player_namet = "";
        this.myControl4.reset();

        this.getallLocation();
        this.loadPlayersInBackground();

        const message = data.status === "true" 
          ? "Date Of Birth Updated Successfully."
          : "Something went wrong!";

        this.snackBar.open(message, undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "blue-snackbar",
        });
      },
      error: () => {
        this.snackBar.open("Failed to update date of birth", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
      }
    });
  }

  onTeamSelected(teamName: string): void {
    if (!teamName) return;
    
    // Find the team ID for the selected team name
    const selectedTeam = this.options3.find(team => {
      try {
        return window.atob(team.team_name) === teamName;
      } catch (error) {
        return false;
      }
    });
    
    if (selectedTeam) {
      this.get_team_id(selectedTeam.team_namee);
    }
  }
}
