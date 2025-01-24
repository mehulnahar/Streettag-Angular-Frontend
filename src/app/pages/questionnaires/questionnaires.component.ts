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
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-questionnaires",
  templateUrl: "./questionnaires.component.html",
  styleUrls: ["./questionnaires.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class QuestionnairesComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  myControl1 = new FormControl();
  options1: any = [];
  private readonly baseUrl = environment.baseUrl;
  filteredOptions1: Observable<any[]>;

  public settings: Settings;
  public sidenavOpen: boolean = true;

  public newMail: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;

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
    "rank",
    "team_name",
    "total_points",
    "number_of_players",
  ];
  public dataSource: any;
  public dataSource2: any;
  public rank1 = false;
  public rank2 = false;
  public rank3 = false;

  selectedPlayer = "";

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.checkuserlogin();
    this.getallLocation();
    this.getAllPlayers();
  }

  checkuserlogin() {
    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");

    if (username == null && password == null) {
      this.snackBar.open("You must login", null, {
        duration: 1700,
        verticalPosition: "top",
      });
      this.router.navigate(["/login"]);
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    //this.getallConsents()
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
  //public device_token = '';
  //public device_type = '';

  //public location_id = '';
  //public circuit_id = '';
  //public team_id = '';
  //public location_name = '';
  public team_name = "0";
  public player_id = "";
  public player_id2 = "";
  //public player_name = '';
  //public player_email = '';
  //public player_team = '';
  public spinner: any;

  public is_all = true;

  getallLocation() {
    var url = `${this.baseUrl}getTeam`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      // //console.log('>>>>>>>>>>>>>>>>>>>');
      // //console.log(this.dataSourceLocation);
      // //console.log('>>>>>>>>>>>>>>>>>>>');
    });
  }
  getAllPlayers() {
    this.dataSourceAllPlayers = [];

    var url = `${this.baseUrl}getAllPlayersList`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceAllPlayers = data["response"];

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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options1.filter((option) =>
      option.player_idd.toLowerCase().includes(filterValue)
    );
  }

  get_team_id(res) {
    // this.player_name = '';
    // this.player_email = '';
    // this.player_team = '';
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

    var url = `${this.baseUrl}getPlayerByTeam`;

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
      this.is_all = false;

      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');

      //console.log(this.dataSourcePlayers);
      //this.dataSource2 = [];
      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');
    });
  }

  get_player_id(res) {
    this.selectedPlayer = res;
 
    // this.points = '';
    // // this.player_name = '';
    // // this.player_email = '';
    // // this.player_team = '';

    // var url = "${this.baseUrl}getPlayerDetails";

    // var data1 = {
    // 	"player_id": res,
    // };

    // if (data1.player_id == "") {
    // 	return false;
    // }

    // //console.log(data1.player_id);

    // this.ajaxService.post(data1, url).subscribe(
    // 	data => {

    // 		this.dataSourcePlayersDetails = data['response'];
    // 		//console.log(this.dataSourcePlayersDetails);

    // 		// this.player_name = this.dataSourcePlayersDetails[0].fullname;
    // 		// this.player_email = this.dataSourcePlayersDetails[0].email;
    // 		// this.player_team = this.dataSourcePlayersDetails[0].team_name;
    // 		// this.device_token = this.dataSourcePlayersDetails[0].device_token;
    // 		// this.device_type = this.dataSourcePlayersDetails[0].device_type;
    // 		// this.circuit_id = this.dataSourcePlayersDetails[0].circuit_id;
    // 		// this.location_id = this.dataSourcePlayersDetails[0].location_id;
    // 		// this.team_id = this.dataSourcePlayersDetails[0].team_id;

    // 	})
  }

  public qdata;
  public qdata1;
  public qdata2;
  public show_table = false;
  public subdata = false;
  public subdata2 = false;
  public subdata3 = false;

  public after1 = false;
  public after2 = false;
  public after3 = false;

  public before1 = false;
  public before2 = false;
  public before3 = false;
  onSubmit(data) {
    var data2 = {
      player_id: this.selectedPlayer,
    };

    var check1 = 1;

    if (data2.player_id == "" || typeof data2.player_id == "undefined") {
      check1 = 0;
    }

    if (check1 == 1) {
      //console.log('valid');
    } else {
      //console.log('invalid');

      this.snackBar.open("Please select player", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
      return false;
    }

    data = {
      player_id: this.selectedPlayer,
    };
    var url = `${this.baseUrl}questionnairesData`;

    //console.log('sending data')
    //console.log(data)
    //console.log('sending data')

    this.ajaxService.post(data, url).subscribe((data) => {
      this.qdata = data["response"];

      if (data["response"].length > 0) {
        this.show_table = true;

        this.qdata[0].question_text = JSON.parse(this.qdata[0].question_text);
        //console.log(this.qdata[0].question_text);
        this.qdata[1].question_text = JSON.parse(this.qdata[1].question_text);
        //console.log(this.qdata[1].question_text);
        this.qdata1 = this.qdata[0].question_text;
        this.qdata2 = this.qdata[1].question_text;
        //sub question one
        if (
          this.qdata1.q1.subques.a.ans != "" &&
          this.qdata1.q1.subques.b.ans != "" &&
          this.qdata1.q1.subques.c.ans != ""
        ) {
          this.subdata = true;
        }
        //sub question two
        if (
          this.qdata1.q2.subques.a.ans != "" &&
          this.qdata1.q2.subques.b.ans != "" &&
          this.qdata1.q2.subques.c.ans != ""
        ) {
          this.subdata2 = true;
        }
        //sub question three
        if (
          this.qdata1.q3.subques.a.ans != "" &&
          this.qdata1.q3.subques.b.ans != "" &&
          this.qdata1.q3.subques.c.ans != ""
        ) {
          this.subdata3 = true;
        }

        if (this.qdata1.q1.ans != "") {
          this.before1 = true;
        }
        if (this.qdata1.q2.ans != "") {
          this.before2 = true;
        }
        if (this.qdata1.q3.ans != "") {
          this.before3 = true;
        }

        if (this.qdata2.q1.ans != "") {
          this.after1 = true;
        }
        //  if(this.qdata2.q2.ans != ''){
        // 	this.after2 = true;
        //  }
        //  if(this.qdata2.q3.ans != ''){
        // 	this.after3 = true;
        //  }

        // this.snackBar.open('successfully', null, {
        // 		duration: 3000,
        // 		verticalPosition: 'top',
        // 		panelClass: 'blue-snackbar'
        // 	});
      } else {
        this.show_table = false;

        this.snackBar.open("No Record Found!", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "blue-snackbar",
        });
      }
      //this.show_table = true;
      this.team_name = "0";
      this.player_id = "";
      this.player_id2 = "";
      this.points = "";
      this.is_all = true;
      this.getAllPlayers();

      // if (data['status'] == 'true') {
      // 	//console.log('ok');
      // 	this.snackBar.open('successfully', null, {
      // 		duration: 3000,
      // 		verticalPosition: 'top',
      // 		panelClass: 'blue-snackbar'
      // 	});
      // } else {

      // 	this.snackBar.open('successfully', null, {
      // 		duration: 3000,
      // 		verticalPosition: 'top',
      // 		panelClass: 'blue-snackbar'
      // 	});
      // }
    });
  }
}
