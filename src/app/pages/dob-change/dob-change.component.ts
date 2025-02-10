import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
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
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";
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
export class DobChangeComponent implements OnInit {
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
    this.getAllPlayers();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
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
    // Setup team autocomplete
      this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (!value) {
            this.getAllPlayers();
          return this.options3;
          }
          return this._filterTeam(value);
        })
      );

    // Setup player autocomplete
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  onPlayerIdFocus(): void {
    // Show all options when field is focused
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map(value => this.options1)
    );
  }

  getallLocation() {
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
        }
      },
      error: (error) => {
        console.error('Failed to fetch locations:', error);
        this.snackBar.open("Failed to fetch locations", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
      }
    });
  }

  getAllPlayers() {
    const url = `${this.baseUrl}getAllPlayersList`;
    this.ajaxService.get(url).subscribe({
      next: (response) => {
        try {
          const data = this.handleApiResponse(response);
          if (Array.isArray(data.response)) {
            this.dataSourceAllPlayers = data.response.map(item => ({
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
      this.options1 = this.dataSourceAllPlayers;
          } else {
            console.error('Invalid player data format:', data);
            this.snackBar.open("Invalid data format received", undefined, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: "red-snackbar",
            });
          }
        } catch (error) {
          console.error('Error processing player data:', error);
          this.snackBar.open("Error processing data", undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
        }
      },
      error: (error) => {
        console.error('Failed to fetch players:', error);
        this.snackBar.open("Failed to fetch players", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
      }
    });
  }

  get_player_id(res: string): void {
    if (!res) return;

    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    const data = { player_id: window.atob(res) };

    this.ajaxService.post(data, url).subscribe({
      next: (response) => {
        const data = this.handleApiResponse(response);
        this.dataSourcePlayersDetails = data.response;
        
        if (this.dataSourcePlayersDetails.length > 0) {
          const details = this.dataSourcePlayersDetails[0];
          this.player_name = details.fullname;
          this.player_email = details.email;
          this.player_dob = details.date_of_birth;
          this.player_team = details.team_name;
          this.device_token = details.device_token;
          this.device_type = details.device_type;
          this.circuit_id = details.circuit_id;
          this.location_id = details.location_id;
          this.team_id = details.team_id;
          this.player_id = window.atob(details.player_id);

          this.searchForm.patchValue({
            device_token: details.device_token,
            device_type: details.device_type,
            location_id: details.location_id,
            circuit_id: details.circuit_id,
            team_id: details.team_id,
            player_email: details.email,
            player_id: window.atob(details.player_id)
          });
        }
      },
      error: () => {
        this.snackBar.open("Failed to fetch player details", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
      }
    });
  }

  get_team_id(res: string): void {
    if (res === "0") {
      this.resetPlayerData();
      this.is_all = true;
      return;
    }

    const selectedTeam = this.options3.find(team => team.team_name === res);
    if (!selectedTeam) {
      console.error('Team not found');
      return;
    }

    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    const data = { team_id: selectedTeam.team_id };

    if (!data.team_id) return;

    this.ajaxService.post(data, url).subscribe({
      next: (response) => {
        const data = this.handleApiResponse(response);
        this.dataSourcePlayers = data.response;
        this.player_namet = "";
        this.options1 = this.dataSourcePlayers;

        this.filteredOptions1 = this.myControl1.valueChanges.pipe(
          startWith(''),
          map((value) => {
            if (value) {
              this.get_player_id(value);
            }
            return this._filter(value || '');
          })
        );

        this.is_all = false;
      },
      error: () => {
        this.snackBar.open("Failed to fetch team players", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        });
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
    if (!value) return this.options1;
    const filterValue = value.toLowerCase();
    return this.options1.filter(option => 
      option.player_idd?.toLowerCase().includes(filterValue) ||
      window.atob(option.fullname || '').toLowerCase().includes(filterValue)
    );
  }

  private _filterTeam(value: string): TeamDetails[] {
    const filterValue = value.toLowerCase();
    return this.options3.filter(option => 
      option.team_namee?.toLowerCase().includes(filterValue) ||
      option.team_name?.toLowerCase().includes(filterValue)
    );
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
      player_id: window.btoa(this.player_id),
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
        this.getAllPlayers();

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
}
