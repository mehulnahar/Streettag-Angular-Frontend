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
  import { DateAdapter } from "@angular/material";

  import * as moment from 'moment';
  import { ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirmDialog.model';
  import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
  import { E } from "@angular/cdk/keycodes";


  
  @Component({
    selector: 'app-user-delete',
    templateUrl: './user-delete.component.html',
    styleUrls: ['./user-delete.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [],
  })



  export class UserDeleteComponent implements OnInit {
  
    @ViewChild("sidenav", { static: false }) sidenav: any;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    private readonly baseUrl = environment.baseUrl;
  
    public myControl1 = new FormControl();
    options1: any = [];
  
    public myControl2 = new FormControl();
    options2: any = [];
  
    public myControl3 = new FormControl();
    options3: any = [];
    
    public myControl4 = new FormControl();
  
    public filteredOptions1: Observable<any>;
    public filteredOptions2: Observable<any>;
    public filteredOptions3: Observable<any>;
  
    public settings: Settings;
    public sidenavOpen: boolean = true;
  
    public newMail: boolean;
    public type: string = "all";
    public showSearch: boolean = false;
    public searchText: string;
    public form: FormGroup;
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
      private dateAdapter : DateAdapter<Date>
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
  
    getAllTeams() {

      var url = `${this.baseUrl}getTeamAdmin`;
  
      this.ajaxService.get(url).subscribe((data) => {

        this.dataSourceLocation = data["response"];
        //console.log("getTeamAdmin", this.dataSourceLocation);
  
        this.options3 = this.dataSourceLocation;
  
        this.filteredOptions3 = this.myControl3.valueChanges.pipe(
          startWith(""),
          map((value) => {
            //console.log("valuel", value);
  
            if (value == "") {
              this.getAllPlayers();
            } else {
              this.get_team_id(value);
            }
  
            return this._filterTeam(value);
          })
        );
      });
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.options1.filter((option) =>
        option.player_idd.toLowerCase().includes(filterValue)
      );
    }
  
    private _filterTeam(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.options3.filter((option) =>
        option.team_namee.toLowerCase().includes(filterValue)
      );
    }
  

    getAllPlayers() {

      this.dataSourceAllPlayers = [];
  
      var url = `${this.baseUrl}getAllPlayersList`;
  
      this.ajaxService.get(url).subscribe((data) => {

        this.dataSourceAllPlayers = data["response"];
        //this.dataSourceAllPlayers = data['response'];
  
        //console.log("getAllPlayersList", this.dataSourceAllPlayers);
  
        this.options1 = this.dataSourceAllPlayers;
  
        this.filteredOptions1 = this.myControl1.valueChanges.pipe(
          startWith(""),
          map((value) => {
            //console.log(value);
            this.get_player_id(value);
            return this._filter(value);
          })
        );
  
        //console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
        //console.log(this.dataSourceAllPlayers);
        //console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
      });
    }
  
    get_player_id(res) {
      this.points = "";
      this.player_name = "";
      this.player_email = "";
      this.player_dob = "";
      this.player_points = "";
      this.player_team = "";
      
  
      var url = `${this.baseUrl}getPlayerDetailsAdmin`;
  
      var data1 = {
        player_id: res,
      };
  
      if (data1.player_id == "") {
        return false;
      }
  
      //console.log(data1.player_id);
  
      this.ajaxService.post(data1, url).subscribe((data) => {
        this.dataSourcePlayersDetails = data["response"];
        //console.log(this.dataSourcePlayersDetails);
  
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
      });
    }
  
    get_team_id(res) {
      this.player_name = "";
      this.player_email = "";
      this.player_dob = "";
      this.player_points = "";
      this.player_team = "";
      this.player_id = "";
      this.player_id2 = "";
      this.points = "";
  
      //this.dataSourceAllPlayers = [];
  
      if (res == "0") {
        this.player_id = "";
        this.player_id2 = "";
        this.is_all = true;
        return false;
      }
  
      this.dataSourcePlayers = [];
      //this.dataSourceAllPlayers = [];
  
      var url = `${this.baseUrl}getPlayerByTeamAdmin`;
  
      var data1 = {
        team_id: res,
      };
  
      if (data1.team_id == "") {
        return false;
      }
  
      //console.log(data1.team_id);
  
      //this.location_id = res;
  
      this.ajaxService.post(data1, url).subscribe((data) => {

        this.dataSourcePlayers = data["response"];
  
        this.player_namet = "";
  
        this.options1 = this.dataSourcePlayers;
  
        this.filteredOptions1 = this.myControl1.valueChanges.pipe(
          startWith(""),
          map((value) => {
            this.get_player_id(value);
            return this._filter(value);
          })
        );
  
        this.is_all = false;
      });
    }


    confirmDialog(data) {

        const message = `Are you sure you want to delete ${data} ?`;
        const dialogData = new ConfirmDialogModel('Confirm Action', message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '600px',
          data: dialogData,
        });

        
    
        dialogRef.afterClosed().subscribe((dialogResult) => {
          
            if (dialogResult == true) {

                this.spinner = true;
                this.isVailid = true;

                var url = `${this.baseUrl}deleteUserByAdmin`;
                var dataobj = { data };
    
                this.ajaxService.post(dataobj, url).subscribe(

                (data) => {

                    this.resData = data;

                    this.player_name = "";
                    this.player_points = "";
                    this.player_email = "";
                    this.player_dob = "";
                    this.player_points = "";
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
        
                    this.getAllTeams();

                    this.snackBar.open('User Removed Successfully!', null, {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: "blue-snackbar",
                    });


                    this.spinner = false;
                    this.isVailid = true;
                },
                (error) => {

                    // this.snackBar.open(error.message, null, {
                    // duration: 3000,
                    // verticalPosition: 'top',
                    // panelClass: "red-snackbar",
                    // });

                    this.snackBar.open('User Removed Successfully!', null, {
                      duration: 3000,
                      verticalPosition: 'top',
                      panelClass: "blue-snackbar",
                      });

                    this.spinner = false;
                    this.isVailid = true;
                }
                );
          }else{

            this.player_name = "";
            this.player_points = "";
            this.player_email = "";
            this.player_dob = "";
            this.player_points = "";
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

            this.getAllTeams();
            this.spinner = false;
            this.isVailid = true;
          }
        });  
      }
  
  }
  