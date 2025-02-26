import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    HostListener,
    Inject,
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
  
  import { startWith, map } from "rxjs/operators";
  import { Observable } from "rxjs";
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
                <mat-option *ngFor="let option of filteredOptions3 | async" [value]="option.team_name | decode">
                  {{option.team_name | decode}}
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
                <mat-option *ngFor="let option of filteredOptions1 | async" [value]="option.player_idd ? (option.player_idd | decode) : ''">
                  {{option.fullname ? (option.fullname | decode) : ''}} ({{option.player_idd ? (option.player_idd | decode) : ''}})
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
export class UserDeleteComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table configuration
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'created_at', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();

  // Form controls
  myControl1 = new FormControl<string>('');
  myControl3 = new FormControl<string>('');
  
  // Autocomplete options
  options1: PlayerDetails[] = [];
  options3: any[] = [];
  filteredOptions1!: Observable<PlayerDetails[]>;
  filteredOptions3!: Observable<any[]>;

  // Component state
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public spinner: boolean = false;
  private readonly baseUrl = environment.baseUrl;
  
  // Data sources
  public dataSourceLocation: any[] = [];
  public dataSourceAllPlayers: any[] = [];
  public dataSourcePlayers: any[] = [];
  public dataSourcePlayersDetails: any[] = [];
  public dataSourceLeaderboard: any[] = [];
  public dataSourceTeamDataAnalysis: any[] = [];

  // Player related properties
  public player_name: string = '';
  public player_email: string = '';
  public player_dob: string = '';
  public player_points: string = '';
  public player_team: string = '';
  public player_namet: string = '';
  public player_id: string = '';
  public player_id2: string = '';
  
  // Other properties
  public device_token: string = '';
  public device_type: string = '';
  public circuit_id: string = '';
  public location_id: string = '';
  public team_id: string = '';
  public points: string = '';
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
    this.settings = this.appSettings.settings;
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    // this.getUsers();
    this.getAllTeams();
    this.setupAutoComplete();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  getUsers() {
    this.spinner = true;
    const url = `${this.baseUrl}getUsersByAdmin`;
    
    this.ajaxService.get<ApiResponse<User>>(url).subscribe({
      next: (response) => {
        if (response.response) {
          this.dataSource.data = response.response;
        }
        this.spinner = false;
      },
      error: () => {
        this.snackBar.open('Failed to fetch users', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.spinner = false;
      }
    });
  }

  getAllTeams() {
    const url = `${this.baseUrl}getTeamAdmin`;
    
    this.ajaxService.get<ApiResponse<any>>(url).subscribe({
      next: (response) => {
        if (response.response) {
          this.dataSourceLocation = response.response;
          this.options3 = this.dataSourceLocation;
          
          this.filteredOptions3 = this.myControl3.valueChanges.pipe(
            startWith(''),
            map((value: string | null) => {
              const searchValue = value || '';
              if (!searchValue) {
                this.getAllPlayers();
              } else {
                this.get_team_id(searchValue);
              }
              return this._filterTeam(searchValue);
            })
          );
        }
      }
    });
  }

  private _filter(value: string): PlayerDetails[] {
    const filterValue = value.toLowerCase();
    return this.options1.filter(option => {
      const playerIdMatch = option.player_idd ? window.atob(option.player_idd).toLowerCase().includes(filterValue) : false;
      const nameMatch = option.fullname ? window.atob(option.fullname).toLowerCase().includes(filterValue) : false;
      return playerIdMatch || nameMatch;
    });
  }

  private _filterTeam(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options3.filter((option: any) => {
      const teamName = option.team_name ? window.atob(option.team_name).toLowerCase() : '';
      return teamName.includes(filterValue);
    });
  }

  setupAutoComplete() {
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._filter(value || ''))
    );
  }

  onPlayerIdFocus(): void {
    // Show all options when field is focused
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map(() => this.options1)
    );
  }

  confirmDialog(userId: string): void {
    const message = `Are you sure you want to delete this user?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.spinner = true;
        const url = `${this.baseUrl}deleteUserByAdmin`;
        const decodedId = window.atob(userId);
        const dataobj = { data: decodedId };

        this.ajaxService.post<ApiResponse<unknown>>(dataobj, url).subscribe({
          next: (response: any) => {
            if (response.data && response.data.status === true) {
              this.snackBar.open('User Removed Successfully!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
              // Reset form and player details after successful deletion
              this.player_name = '';
              this.player_email = '';
              this.player_dob = '';
              this.player_points = '';
              this.player_team = '';
              this.player_id = '';
              this.player_id2 = '';
              this.points = '';
              this.myControl1.reset();
              this.getAllPlayers();
            } else {
              this.snackBar.open(response.data?.msg || 'Failed to remove user', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
            }
            this.spinner = false;
          },
          error: () => {
            this.snackBar.open('Failed to remove user', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
            this.spinner = false;
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllPlayers() {
    const url = `${this.baseUrl}getAllPlayersList`;
    
    this.ajaxService.get<ApiResponse<PlayerDetails>>(url).subscribe({
      next: (response) => {
        if (response.response) {
          this.dataSourceAllPlayers = response.response.map(player => ({
            ...player,
            player_idd: player.player_id // Ensure player_idd is set from player_id
          }));
          this.options1 = this.dataSourceAllPlayers;
          
          this.filteredOptions1 = this.myControl1.valueChanges.pipe(
            startWith(''),
            map((value: string | null) => {
              const searchValue = value || '';
              return this._filter(searchValue);
            })
          );
        }
      }
    });
  }

  get_player_id(res: string): void {
    if (!res) return;

    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    const data = { player_id: res };

    this.ajaxService.post<ApiResponse<PlayerDetails>>(data, url).subscribe({
      next: (response) => {
        if (response.response.length > 0) {
          const details = response.response[0];
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
      },
      error: (error: unknown) => {
        this.snackBar.open('Failed to fetch player details', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  get_team_id(res: string): boolean {
    // Reset player-related fields
    this.player_name = '';
    this.player_email = '';
    this.player_dob = '';
    this.player_points = '';
    this.player_team = '';
    this.player_id = '';
    this.player_id2 = '';
    this.points = '';

    if (res === '0') {
      this.player_id = '';
      this.player_id2 = '';
      this.is_all = true;
      return false;
    }

    this.dataSourcePlayers = [];
    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    const data1 = { team_id: res };

    if (!data1.team_id) {
      return false;
    }

    this.ajaxService.post<ApiResponse<any>>(data1, url).subscribe({
      next: (response) => {
        if (response.response) {
          this.dataSourcePlayers = response.response;
          this.player_namet = '';
          this.options1 = this.dataSourcePlayers;
          
          this.filteredOptions1 = this.myControl1.valueChanges.pipe(
            startWith(''),
            map((value: string | null) => {
              const searchValue = value || '';
              this.get_player_id(searchValue);
              return this._filter(searchValue);
            })
          );
          
          this.is_all = false;
        }
      }
    });

    return true;
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      const url = `${this.baseUrl}deleteUserByAdmin`;
      const data = { data: user.id };
      
      this.ajaxService.post<ApiResponse<unknown>>(data, url).subscribe({
        next: (response) => {
          if (response.status === 'true' || response.status === true) {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.getUsers(); // Refresh the table
          } else {
            this.snackBar.open(response.message || 'Failed to delete user', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        },
        error: () => {
          this.snackBar.open('Failed to delete user', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
  