import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    HostListener,
    Inject,
    OnDestroy,
  } from "@angular/core";
  import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
  import { MatPaginator } from "@angular/material/paginator";
  import { MatSnackBar } from "@angular/material/snack-bar";
  import { MatTableDataSource } from "@angular/material/table";
  import { AppSettings } from "../../app.settings";
  import { Settings } from "../../app.settings.model";
  import { AjaxService } from "src/app/ajax.service";
  import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
  import { Router } from "@angular/router";
  import { MatSort } from "@angular/material/sort";
  
  import { startWith, map, debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
  import { Observable, Subject } from "rxjs";
  import { environment } from "src/environments/environment";
  
  import { formatDate } from "@angular/common";
  import { DateAdapter } from "@angular/material/core";

  import * as moment from 'moment';
  import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
  import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
  import { E } from "@angular/cdk/keycodes";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  status: string;
}

interface PlayerDetails {
  fullname: string;
  email: string;
  date_of_birth: string;
  score_points: string;
  team_name: string;
  device_token: string;
  device_type: string;
  circuit_id: string;
  location_id: string;
  team_id: string;
  player_id: string;
  player_idd?: string;
}

interface ApiResponse<T> {
  status: string | boolean;
  message?: string;
  response: T[];
}

@Component({
  selector: 'app-user-delete',
  template: `
    <app-content-header 
      [icon]="'person_remove'" 
      [title]="'User Remove'" 
      [hideBreadcrumb]="true" 
      [hasBgImage]="true" 
      [class]="'pb-4'">
    </app-content-header>

    <div class="p-3">
      <mat-card class="custom-card">
        <mat-card-content>
          <form class="user-form" (ngSubmit)="$event.preventDefault()">
            <!-- Team Name Field -->
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Team Name</mat-label>
              <input type="text" 
                matInput 
                [formControl]="myControl3" 
                [matAutocomplete]="auto3"
                placeholder="Search team">
              <mat-autocomplete #auto3="matAutocomplete">
                <mat-option *ngFor="let option of filteredOptions3 | async" [value]="option.team_namee">
                  {{option.team_namee }}
                </mat-option>
              </mat-autocomplete>
              <mat-hint>Not mandatory</mat-hint>
            </mat-form-field>

            <!-- Player ID Field -->
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Player ID</mat-label>
              <input type="text" 
                matInput 
                [formControl]="myControl1" 
                [matAutocomplete]="auto1"
                placeholder="Search player by ID or name"
                (focus)="onPlayerIdFocus()">
              <mat-autocomplete #auto1="matAutocomplete" (optionSelected)="get_player_id($event.option.value)">
                <mat-option *ngFor="let option of filteredOptions1 | async" [value]="option.player_idd || ''">
                        {{option.player_idd}}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <!-- Player Details Card -->
            <div *ngIf="player_name" class="player-details-card mb-4">
              <mat-card>
                <mat-card-content>
                  <h3 class="mb-3">Player Details</h3>
                  <div class="details-grid">
                    <div class="detail-item">
                      <label>Name:</label>
                      <p>{{player_name ? (player_name | decode) : ''}}</p>
                    </div>
                    <div class="detail-item">
                      <label>Email:</label>
                      <p>{{player_email ? (player_email | decode) : ''}}</p>
                    </div>
                    <div class="detail-item">
                      <label>Score Points:</label>
                      <p>{{player_points ? (player_points) : ''}}</p>
                    </div>
                    <div class="detail-item">
                      <label>Team:</label>
                      <p>{{player_team ? (player_team | decode) : ''}}</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <!-- Remove Button -->
            <div class="text-center">
              <button type="button" 
                mat-raised-button 
                color="warn" 
                class="remove-btn" 
                [disabled]="!player_id"
                (click)="confirmDialog(player_id)">
                <mat-icon>delete</mat-icon>
                Remove
              </button>
              <div *ngIf="spinner" class="mt-3">
                <mat-progress-spinner diameter="30" mode="indeterminate"></mat-progress-spinner>
              </div>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .custom-card {
      margin: 16px;
      border-radius: 8px;
    }
    .user-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px;
    }
    .player-details-card {
     
      border-radius: 8px;
      padding: 2px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .detail-item {
      margin-bottom: 8px;
    }
    .detail-item label {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 4px;
      display: block;
    }
    .detail-item p {
      margin: 0;
      font-size: 1em;
      color: #333;
    }
    .remove-btn {
      min-width: 120px;
      margin-top: 16px;
    }
    .mat-icon {
      margin-right: 8px;
    }
  `]
})
export class UserDeleteComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public spinner: boolean = false;
  public isVailid: boolean = true;
  public is_all: boolean = true;
  
  // Form controls
  public myControl1 = new FormControl('');
  public myControl3 = new FormControl('');
  options1: PlayerDetails[] = [];
  options3: any[] = [];
  public filteredOptions1: Observable<PlayerDetails[]> = new Observable<PlayerDetails[]>();
  public filteredOptions3: Observable<any[]> = new Observable<any[]>();

  // Data sources - using Maps for faster lookups
  private playerMap = new Map<string, PlayerDetails>();
  private teamMap = new Map<string, any>();
  public dataSourceLocation: any[] = [];
  public dataSourceAllPlayers: any[] = [];
  public dataSourcePlayers: any[] = [];
  public dataSourcePlayersDetails: any[] = [];

  // Player and team related properties
  public team_name: string = "0";
  public team_namet: string = "";
  public player_namet: string = "";
  public player_name: string = "";
  public player_email: string = "";
  public player_dob: string = "";
  public player_points: string = "";
  public player_team: string = "";
  public player_id: string = "";
  public player_id2: string = "";
  public points: string = "";
  
  // Other properties
  public device_token: string = "";
  public device_type: string = "";
  public circuit_id: string = "";
  public location_id: string = "";
  public team_id: string = "";
  private readonly baseUrl = environment.baseUrl;
  
  // Subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.settings = this.appSettings.settings;
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getAllTeams();
    this.setupAutoComplete();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  private _filter(value: string): PlayerDetails[] {
    if (!value) return this.options1.slice(0, 20); // Return first 20 items when empty
    
    const filterValue = value.toLowerCase();
    // When user is actively searching, do a full search across all items
    return this.options1.filter((option: PlayerDetails) => {
      // Try to get decoded values only once
      let playerIdLower = '';
      let fullnameLower = '';
      
      try {
        playerIdLower = option.player_idd ? window.atob(option.player_idd).toLowerCase() : '';
        fullnameLower = option.fullname ? window.atob(option.fullname).toLowerCase() : '';
      } catch (e) {
        // Handle decoding errors silently
        playerIdLower = option.player_idd ? option.player_idd.toLowerCase() : '';
        fullnameLower = option.fullname ? option.fullname.toLowerCase() : '';
      }
      
      return playerIdLower.includes(filterValue) || fullnameLower.includes(filterValue);
    }); // Don't limit results when user is actively searching
  }

  private _filterTeam(value: string): any[] {
    if (!value) return this.options3.slice(0, 20); // Return first 20 items when empty
    
    const filterValue = value.toLowerCase();
    // When user is actively searching, do a full search across all items
    return this.options3.filter((option: any) => {
      let teamName = '';
      
      try {
        teamName = option.team_namee ? window.atob(option.team_namee).toLowerCase() : '';
      } catch (e) {
        // Handle decoding errors silently
        teamName = option.team_namee ? option.team_namee.toLowerCase() : '';
      }
      
      return teamName.includes(filterValue);
    }); // Don't limit results when user is actively searching
  }

  get_team_id(res: string): boolean {
    this.resetPlayerFields();

    if (res === "0") {
      this.player_id = "";
      this.player_id2 = "";
      this.is_all = true;
      return false;
    }

    this.dataSourcePlayers = [];
    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    const data1 = { team_id: res };

    if (!data1.team_id) {
      return false;
    }

    this.spinner = true;
    this.ajaxService.post(data1, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.response) {
            this.dataSourcePlayers = response.response;
            this.player_namet = "";
            this.options1 = this.dataSourcePlayers;
            
            // Cache players in map for faster lookups
            this.playerMap.clear();
            this.dataSourcePlayers.forEach(player => {
              if (player.player_idd) {
                this.playerMap.set(player.player_idd, player);
              }
            });

            this.setupPlayerAutocomplete();
            this.is_all = false;
          }
          this.spinner = false;
        },
        error: () => {
          this.spinner = false;
        }
      });

    return true;
  }

  getAllTeams() {
    this.spinner = true;
    const url = `${this.baseUrl}getTeamAdmin`;

    this.ajaxService.get(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.response) {
            this.dataSourceLocation = response.response;
            this.options3 = this.dataSourceLocation;
            
            // Cache teams in map for faster lookups
            this.teamMap.clear();
            this.dataSourceLocation.forEach(team => {
              if (team.team_namee) {
                this.teamMap.set(team.team_namee, team);
              }
            });

            this.setupTeamAutocomplete();
          }
          this.spinner = false;
          this.getAllPlayers(); // Load players after teams
        },
        error: () => {
          this.spinner = false;
        }
      });
  }

  setupAutoComplete() {
    this.setupPlayerAutocomplete();
    this.setupTeamAutocomplete();
  }
  
  setupPlayerAutocomplete() {
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Add debounce to reduce API calls
      distinctUntilChanged(),
      map((value: string | null) => {
        const searchValue = value || '';
        // If user has typed something, call get_player_id to fetch details
        if (value && value.trim().length > 0) {
          this.get_player_id(value);
        }
        // If search is empty, limit to 20 items, otherwise do full search
        return this._filter(searchValue);
      })
    );
  }
  
  setupTeamAutocomplete() {
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Add debounce to reduce API calls
      distinctUntilChanged(),
      map((value: string | null) => {
        const searchValue = value ? value.toLowerCase() : '';
        if (!value) {
          this.getAllPlayers();
        } else {
          this.get_team_id(value);
        }
        // If search is empty, limit to 20 items, otherwise do full search
        return this._filterTeam(searchValue);
      })
    );
  }

  onPlayerIdFocus(): void {
    // Show limited options when field is focused and empty
    // But allow full search when user types
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => {
        if (!value) {
          return this.options1.slice(0, 20);
        } else {
          return this._filter(value);
        }
      })
    );
  }

  confirmDialog(userId: string): void {
    if (!userId) return;
    
    let decodedId;
    try {
      decodedId = window.atob(userId);
    } catch (e) {
      decodedId = userId;
    }
    
    const message = `Are you sure you want to delete ${decodedId} ?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dialogResult) => {
        if (dialogResult === true) {
          this.deleteUserConfirmed(decodedId);
        }
      });
  }
  
  deleteUserConfirmed(decodedId: string): void {
    this.spinner = true;
    const url = `${this.baseUrl}deleteUserByAdmin`;
    const dataobj = { data: decodedId };

    this.ajaxService.post<ApiResponse<unknown>>(dataobj, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.resetAllFields();
          this.showSuccessMessage();
        },
        error: () => {
          this.showSuccessMessage();
        }
      });
  }
  
  resetAllFields(): void {
    this.resetPlayerFields();
    this.team_name = "0";
    this.team_namet = "";
    this.player_namet = "";
    this.is_all = true;
    this.myControl1.reset();
    this.myControl3.reset();
    this.getAllTeams();
  }
  
  resetPlayerFields(): void {
    this.player_name = "";
    this.player_email = "";
    this.player_dob = "";
    this.player_points = "";
    this.player_team = "";
    this.device_token = "";
    this.device_type = "";
    this.circuit_id = "";
    this.location_id = "";
    this.team_id = "";
    this.player_id = "";
    this.player_id2 = "";
    this.points = "";
  }
  
  showSuccessMessage(): void {
    this.snackBar.open('User Removed Successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    this.spinner = false;
  }

  getAllPlayers() {
    this.spinner = true;
    const url = `${this.baseUrl}getAllPlayersList`;

    this.ajaxService.get(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.response) {
            this.dataSourceAllPlayers = response.response;
            this.options1 = this.dataSourceAllPlayers;
            
            // Cache players in map for faster lookups
            this.playerMap.clear();
            this.dataSourceAllPlayers.forEach(player => {
              if (player.player_idd) {
                this.playerMap.set(player.player_idd, player);
              }
            });

            this.setupPlayerAutocomplete();
          }
          this.spinner = false;
        },
        error: () => {
          this.spinner = false;
        }
      });
  }

  get_player_id(res: string): void {
    if (!res) {
      this.resetPlayerFields();
      return;
    }
    
    // Always call the API to get the most up-to-date details
    this.spinner = true;
    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    const data = { player_id: res };

    this.ajaxService.post<ApiResponse<PlayerDetails>>(data, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.response && response.response.length > 0) {
            const details = response.response[0];
            this.updatePlayerDetails(details);
            
            // Add to cache
            if (details.player_id) {
              this.playerMap.set(details.player_id, details);
            }
          } else {
            // If no details found, reset fields
            this.resetPlayerFields();
          }
          this.spinner = false;
        },
        error: () => {
          this.snackBar.open('Failed to fetch player details', 'Close', {
            duration: 2000,
            verticalPosition: 'top'
          });
          this.resetPlayerFields();
          this.spinner = false;
        }
      });
  }
  
  updatePlayerDetails(details: PlayerDetails): void {
    this.player_name = details.fullname;
    this.player_email = details.email;
    this.player_dob = details.date_of_birth;
    // Convert score_points to number and handle base64 decoding if needed
    this.player_points = details.score_points ? 
      (typeof details.score_points === 'string' && details.score_points.includes('=') ? 
        window.atob(details.score_points) : 
        details.score_points.toString()) : 
      '0';
    this.player_team = details.team_name;
    this.device_token = details.device_token;
    this.device_type = details.device_type;
    this.circuit_id = details.circuit_id;
    this.location_id = details.location_id;
    this.team_id = details.team_id;
    this.player_id = details.player_id;
  }
}
  