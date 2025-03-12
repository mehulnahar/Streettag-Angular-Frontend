import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

export interface QuestionnaireResponse {
  question: string;
  answer: string;
}

export interface Player {
  id?: number;
  player_id?: string; // Base64 encoded player ID
  player_idd: string; // Decoded player ID
  team_name?: string;
  fullname?: string;
}

@Component({
  selector: "app-questionnaires",
  templateUrl: "./questionnaires.component.html",
  styleUrls: ["./questionnaires.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionnairesComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  private readonly baseUrl = environment.baseUrl;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public form: FormGroup;

  public playerId: string = '';
  public beforeQuestions: QuestionnaireResponse[] = [];
  public afterQuestions: QuestionnaireResponse[] = [];
  public playersList: Player[] = [];
  
  // New properties for optimized search
  public playerSearchControl = new FormControl<string>('');
  public filteredPlayers!: Observable<Player[]>;
  public isSearching = false;
  public isPlayersLoaded = false;
  private allPlayersCache: Player[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    private http: HttpClient
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({
      search: ['']
    });
    
    // Setup autocomplete with debounce
    this.filteredPlayers = this.playerSearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        if (!value || typeof value !== 'string' || value.length < 3) {
          return [];
        }
        this.isSearching = true;
        const result = this._filterPlayers(value);
        this.isSearching = false;
        return result;
      })
    );
    
    // Update playerId when selection changes
    this.playerSearchControl.valueChanges.subscribe(value => {
      this.playerId = value || ''; // Handle null values by converting to empty string
    });
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.checkUserLogin();
    this.loadPlayersInBackground();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkUserLogin() {
    const token = localStorage.getItem('JWTtoken');
    if (!token) {
      this.snackBar.open('Authentication token not found. Please login again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/login']);
    }
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }
  
  // Client-side filtering with pagination
  private _filterPlayers(value: string | null): Player[] {
    if (!this.isPlayersLoaded || !value || typeof value !== 'string' || value.length < 3) {
      return [];
    }
    
    const filterValue = value.toLowerCase();
    
    // Filter players and limit to 20 results
    return this.allPlayersCache
      .filter(player => {
        try {
          // player_idd is already decoded in the API response
          const playerIdMatch = player.player_idd ? 
            player.player_idd.toLowerCase().includes(filterValue) : false;
          
          // Check if fullname needs decoding
          const nameMatch = player.fullname ? 
            (typeof player.fullname === 'string' ? 
              player.fullname.toLowerCase().includes(filterValue) : 
              false) : 
            false;
          
          // Check if team_name needs decoding
          const teamMatch = player.team_name ? 
            (typeof player.team_name === 'string' ? 
              player.team_name.toLowerCase().includes(filterValue) : 
              false) : 
            false;
            
          return playerIdMatch || nameMatch || teamMatch;
        } catch (error) {
          console.error('Error filtering player data:', error);
          return false;
        }
      })
      .slice(0, 20); // Limit to 20 results
  }

  public loadPlayersInBackground() {
    this.isSearching = true;
    const token = localStorage.getItem('JWTtoken');
    if (!token) {
      this.snackBar.open('Authentication token not found. Please login again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`${this.baseUrl}getAllPlayersList`, { 
      headers,
      withCredentials: false
    }).subscribe({
      next: (response: any) => {
        console.log('Players List Response:', response);
        if (response && response.response) {
          this.allPlayersCache = response.response.map((player: any) => ({
            id: player.id || 0,
            // Store both encoded and decoded player IDs
            player_id: player.player_id || '',
            player_idd: player.player_idd || '',
            // Use other fields as before
            team_name: player.team_name || '',
            fullname: player.fullname || ''
          }));
          this.isPlayersLoaded = true;
        } else {
          this.snackBar.open('No players data found', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error fetching players list:', error);
        let errorMessage = 'An error occurred while fetching players list';
        
        if (error.status === 401) {
          errorMessage = 'Session expired. Please login again';
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to access players list';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your connection';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.isSearching = false;
      }
    });
  }

  public searchPlayer() {
    if (!this.playerId) {
      this.snackBar.open('Please enter a Player ID', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    const token = localStorage.getItem('JWTtoken');
    if (!token) {
      this.snackBar.open('Authentication token not found. Please login again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Clear existing data
    this.beforeQuestions = [];
    this.afterQuestions = [];

    // Use the decoded player_id (player_idd) directly
    // This is what we already have in this.playerId
    const payload = {
      player_id: this.playerId // Using the decoded player_id
    };

    console.log('Sending request with payload:', payload);

    this.http.post(`${this.baseUrl}questionnairesData`, payload, { 
      headers,
      withCredentials: false
    }).subscribe({
      next: (response: any) => {
        console.log('Raw API Response:', response);
        if (response && response.status === "true") {
          this.handleTeamResponse(response);
        } else {
          this.snackBar.open('No data found for this Player ID', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      },
      error: (error) => {
        console.error('Error fetching questionnaires:', error);
        let errorMessage = 'An error occurred while fetching questionnaire data';
        
        if (error.status === 401) {
          errorMessage = 'Session expired. Please login again';
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to access this data';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your connection';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private handleTeamResponse(data: any) {
    console.log('Handling team response:', data);
    
    if (data && data.status === "true" && data.response) {
      try {
        // First response item contains before questionnaire
        if (data.response[0] && data.response[0].question_text) {
          const beforeData = JSON.parse(data.response[0].question_text);
          this.beforeQuestions = [];
          
          // Parse each question from the before questionnaire
          Object.keys(beforeData).forEach(key => {
            const question = beforeData[key];
            if (question) {
              this.beforeQuestions.push({
                question: question.ques,
                answer: question.ans
              });
            }
          });
          console.log('Before Questions:', this.beforeQuestions);
        }

        // Second response item contains after questionnaire
        if (data.response[1] && data.response[1].question_text) {
          const afterData = JSON.parse(data.response[1].question_text);
          this.afterQuestions = [];
          
          // Parse each question from the after questionnaire
          Object.keys(afterData).forEach(key => {
            const question = afterData[key];
            if (question) {
              this.afterQuestions.push({
                question: question.ques,
                answer: question.ans
              });
            }
          });
          console.log('After Questions:', this.afterQuestions);
        }
      } catch (error) {
        console.error('Error parsing questionnaire data:', error);
        this.snackBar.open('Error parsing questionnaire data', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    } else {
      console.log('No questionnaire data found in response');
    }
  }
}
