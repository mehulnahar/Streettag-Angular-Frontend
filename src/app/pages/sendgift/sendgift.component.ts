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
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from "src/environments/environment";

interface GiftCardData {
  id: number;
  player_id: string;
  email: string;
  amount: string;
  gift_code: string;
  creationRequestId?: string;
  request_id?: string;
  alloted_date: string;
}

interface TeamData {
  id: number;
  team_namee: string;
}

interface PlayerData {
  player_id: string;
  player_idd: string;
  fullname: string;
  email: string;
  team_name: string;
  device_token: string;
  device_type: string;
  circuit_id: string;
  location_id: string;
  team_id: string;
}

interface GiftData {
  id: number;
  amount: number;
}

interface ApiResponse<T> {
  response: T;
  status?: string;
}

@Component({
  selector: "app-sendgift",
  templateUrl: "./sendgift.component.html",
  styleUrls: ["./sendgift.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SendgiftComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  public newMail!: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText!: string;
  public form: FormGroup;
  public i = 0;

  public show_dialog: boolean = false;
  public button_name: any = "Show Login Form!";
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  Location_name = "";
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public displayedColumns = [
    "serial_number",
    "player_id",
    "amount",
    "gift_code",
    "creationRequestId",
    "alloted_date"
  ];
  public dataSource: MatTableDataSource<GiftCardData>;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.dataSource = new MatTableDataSource<GiftCardData>();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    
    // Initialize data with error handling
    this.getallGiftAssign();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  public getMails() {
    switch (this.type) {
    }
  }

  openAddMessageDialog(): void {
  
    const dialogRef = this.dialog.open(send_gift_card, {
      width: '600px',
      disableClose: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getallGiftAssign();
      }
    });
  }

  getallGiftAssign() {
    const url = `${this.baseUrl}getAllgiftPrice`;
    
    this.ajaxService.get<ApiResponse<GiftCardData[]>>(url).subscribe(
      (data) => {
        if (data && data.response) {
          // Convert player IDs to base64 if they aren't already
          const formattedData = data.response.map(item => ({
            ...item,
            player_id: this.ensureBase64(item.player_id)
          }));
          
          this.dataSource = new MatTableDataSource(formattedData);
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        } else {
          console.error('Invalid response format:', data);
          this.snackBar.open("Error loading data. Please try refreshing.", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      (error) => {
        console.error('Error fetching gift cards:', error);
        if (error.status === 401 || error.status === 403) {
          this.snackBar.open("Session expired. Please login again.", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(["/login"]);
        } else {
          this.snackBar.open("Error loading gift cards. Please try again.", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      }
    );
  }

  private ensureBase64(str: string): string {
    // Check if the string is already base64 encoded
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (base64Regex.test(str)) {
      return str;
    }
    
    // If not, encode it to base64
    try {
      return btoa(str);
    } catch (e) {
      console.error('Error encoding to base64:', e);
      return str;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const data = {
        email: this.form.get('email')?.value,
        amount: this.form.get('amount')?.value
      };

      const url = `${this.baseUrl}sendGiftCard`;
      
      this.ajaxService.post<ApiResponse<any>>(data, url).subscribe(
        (response) => {
          if (response && response.status === 'success') {
            this.snackBar.open('Gift card sent successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.form.reset();
            this.getallGiftAssign();
          } else {
            this.snackBar.open('Failed to send gift card. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        (error) => {
          this.snackBar.open('Error sending gift card. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  getSentGiftCards() {
    const url = `${this.baseUrl}getSentGiftCards`;

    this.ajaxService.get<ApiResponse<GiftCardData[]>>(url).subscribe(
      (data) => {
        if (data && data.response && Array.isArray(data.response)) {
          this.dataSource = new MatTableDataSource<GiftCardData>(data.response);
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        }
      },
      (error) => {
        console.error('Error fetching sent gift cards:', error);
      }
    );
  }
}

@Component({
  templateUrl: "send_gift_card.html",
})
export class send_gift_card implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myControl1 = new FormControl();
  myControl2 = new FormControl();
  myControl3 = new FormControl();

  options1: PlayerData[] = [];
  options2: PlayerData[] = [];
  options3: TeamData[] = [];

  filteredOptions1!: Observable<PlayerData[]>;
  filteredOptions2!: Observable<PlayerData[]>;
  filteredOptions3!: Observable<TeamData[]>;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public dataSourceLocation: TeamData[] = [];
  public dataSourceAllPlayers: PlayerData[] = [];
  public dataSourcePlayers: PlayerData[] = [];
  public dataSourcePlayersDetails: PlayerData[] = [];
  public dataSourceAllGift: GiftData[] = [];
  public is_all: boolean = true;

  team_namet = "";
  player_namet = "";
  device_token = "";
  device_type = "";
  location_id = "";
  circuit_id = "";
  team_id = "";
  player_id = "";
  gift_id = "";
  player_name = "";
  player_email = "";
  player_team = "";

  // Add cache and optimization constants
  private readonly DEBOUNCE_TIME = 500; // 500ms debounce
  private readonly MIN_SEARCH_LENGTH = 2;
  private readonly MAX_ITEMS = 30;
  private playerDataCache: PlayerData[] = [];
  private teamDataCache: TeamData[] = [];

  constructor(
    public dialogRef: MatDialogRef<send_gift_card>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.initializeFormControls();
  }

  ngOnInit() {
    this.initializeData();
  }

  private initializeData() {
    this.getallLocation();
    this.getAllPlayers();
    this.getAllCodeMoney();
  }

  private initializeFormControls() {
    // Initialize team search with debounce
    this.myControl3.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      distinctUntilChanged(),
      startWith(""),
      map((value: string) => {
        if (!value) {
          this.getAllPlayers();
          return this.options3.slice(0, this.MAX_ITEMS);
        } else if (value.length >= this.MIN_SEARCH_LENGTH) {
          this.get_team_id(value);
        }
        return this._filterTeam(value);
      })
    ).subscribe();

    // Initialize player search with debounce
    this.myControl1.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      distinctUntilChanged(),
      startWith(""),
      map((value: string) => {
        if (value && value.length >= this.MIN_SEARCH_LENGTH) {
          this.get_player_id(value);
        }
        return this._filter(value);
      })
    ).subscribe();
  }

  getallLocation() {
    if (this.teamDataCache.length > 0) {
      this.dataSourceLocation = this.teamDataCache;
      this.options3 = this.dataSourceLocation;
      this.initializeTeamFilter();
      return;
    }

    const url = `${this.baseUrl}getTeamAdmin`;

    this.ajaxService.get<ApiResponse<TeamData[]>>(url).subscribe({
      next: (data) => {
        if (data && data.response) {
          this.teamDataCache = data.response;
          this.dataSourceLocation = data.response;
          this.options3 = this.dataSourceLocation;
          this.initializeTeamFilter();
        }
      },
      error: (error) => {
        console.error('Error fetching team data:', error);
        this.snackBar.open("Error loading teams. Please try again.", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private initializeTeamFilter() {
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(""),
      map((value: string) => this._filterTeam(value))
    );
  }

  getAllPlayers() {
    if (this.playerDataCache.length > 0) {
      this.dataSourceAllPlayers = this.playerDataCache;
      this.options1 = this.dataSourceAllPlayers;
      this.initializePlayerFilter();
      return;
    }

    const url = `${this.baseUrl}getAllPlayersList`;

    this.ajaxService.get<ApiResponse<PlayerData[]>>(url).subscribe({
      next: (data) => {
        if (data && data.response) {
          this.playerDataCache = data.response;
          this.dataSourceAllPlayers = data.response;
          this.options1 = this.dataSourceAllPlayers;
          this.initializePlayerFilter();
        }
      },
      error: (error) => {
        console.error('Error fetching players:', error);
        this.snackBar.open("Error loading players. Please try again.", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private initializePlayerFilter() {
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(""),
      map((value: string) => this._filter(value))
    );
  }

  private _filter(value: string): PlayerData[] {
    if (!value || value.length < this.MIN_SEARCH_LENGTH) return [];
    
    const filterValue = value.toLowerCase();
    return this.options1
      .filter((option) => {
        // Filter by player_idd instead of player_id
        const searchValue = option.player_idd?.toLowerCase() || '';
        return searchValue.includes(filterValue);
      })
      .slice(0, this.MAX_ITEMS);
  }

  private _filterTeam(value: string): TeamData[] {
    if (!value || value.length < this.MIN_SEARCH_LENGTH) return this.options3.slice(0, this.MAX_ITEMS);
    
    const filterValue = value.toLowerCase();
    return this.options3
      .filter((option) => option.team_namee.toLowerCase().includes(filterValue))
      .slice(0, this.MAX_ITEMS);
  }

  get_team_id(res: string): boolean {
    if (res === "0") {
      this.player_id = "";
      this.is_all = true;
      this.options1 = [];
      this.filteredOptions1 = of([]);
      return false;
    }

    if (!res || res.length < this.MIN_SEARCH_LENGTH) {
      return false;
    }

    const url = `${this.baseUrl}getPlayerByTeamAdmin`;
    const data = { team_id: res };

    if (!data.team_id) {
      return false;
    }

    this.ajaxService.post<ApiResponse<PlayerData[]>>(data, url).subscribe({
      next: (response) => {
        if (response && response.response) {
          // Map the response to ensure we have both player_id and player_idd
          this.dataSourcePlayers = response.response.map(player => ({
            ...player,
            player_idd: player.player_idd || this.decodeBase64(player.player_id)
          }));
          
          this.player_namet = "";
          this.options1 = this.dataSourcePlayers;
          
          // Update the filtered options to show player_idd
          this.filteredOptions1 = of(this.options1);
          this.is_all = false;
        }
      },
      error: (error) => {
        console.error('Error fetching team players:', error);
        this.snackBar.open("Error loading team players", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    return true;
  }

  // Helper method to decode base64 if needed
  private decodeBase64(str: string): string {
    try {
      return atob(str);
    } catch (e) {
      return str;
    }
  }

  get_player_id(res: string): boolean {
    if (!res || res.length < this.MIN_SEARCH_LENGTH) {
      return false;
    }

    const url = `${this.baseUrl}getPlayerDetailsAdmin`;
    const data = { player_id: res };

    this.ajaxService.post<ApiResponse<PlayerData[]>>(data, url)
      .pipe(
        debounceTime(this.DEBOUNCE_TIME)
      )
      .subscribe({
        next: (response) => {
          if (response?.response?.[0]) {
            const details = response.response[0];
            this.updatePlayerDetails(details);
          }
        },
        error: (error) => {
          console.error('Error fetching player details:', error);
          this.snackBar.open('Error loading player details', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });

    return true;
  }

  private updatePlayerDetails(details: PlayerData) {
    this.player_name = details.fullname || '';
    this.player_email = details.email || '';
    this.player_team = details.team_name || '';
    this.device_token = details.device_token || '';
    this.device_type = details.device_type || '';
    this.circuit_id = details.circuit_id || '';
    this.location_id = details.location_id || '';
    this.team_id = details.team_id || '';
    this.player_id = details.player_id || '';
  }

  onSubmit(data: any): boolean {
    let check1 = 1;
    let check3 = 1;
    data["player_id"] = this.player_id;

    if (!data.player_id) {
      check1 = 0;
    }
    if (!data.gift_id) {
      check3 = 0;
    }

    if (check1 === 1 && check3 === 1) {
      const url = `${this.baseUrl}assignPlayerGiftCard`;

      this.ajaxService.post<ApiResponse<any>>(data, url).subscribe((response) => {
        if (response.status === "true") {
          this.snackBar.open("Points send successfully", undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "blue-snackbar",
          });
        } else {
          this.snackBar.open("Points not send successfully", undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "blue-snackbar",
          });
        }
        this.dialogRef.close();
      });
      return true;
    } else {
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
  }

  getAllCodeMoney() {
    const url = `${this.baseUrl}getAllCodeMoney`;

    this.ajaxService.get<ApiResponse<GiftData[]>>(url).subscribe({
      next: (data) => {
        if (data && data.response) {
          this.dataSourceAllGift = data.response;
        }
      },
      error: (error) => {
        console.error('Error fetching gift codes:', error);
        this.snackBar.open("Error loading gift amounts. Please try again.", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
