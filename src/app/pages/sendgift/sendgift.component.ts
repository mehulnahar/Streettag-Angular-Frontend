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
import { Observable } from "rxjs/internal/Observable";
import { startWith } from "rxjs/internal/operators/startWith";
import { map } from "rxjs/internal/operators/map";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-sendgift",
  templateUrl: "./sendgift.component.html",
  styleUrls: ["./sendgift.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class SendgiftComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  private readonly baseUrl = environment.baseUrl;
  public newMail: boolean;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
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
    "PalyerID",
    "amount",
    "gift_card",
    "request_id",
    "alloted_date",
  ];
  public dataSource: any;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    //every 30 second page refrace

    // const delay = 3000; // every 30 sec
    // Observable.interval(delay).subscribe(() => {
    this.getallGiftAssign();
    //});

    this.form = this.formBuilder.group({
      to: ["", Validators.required],
      cc: null,
      subject: null,
      message: null,
    });
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

  ////////////////////open edit dialoge/////////////////////////
  // openEditDialog(event): void {

  //   //console.log(event);

  //   //console.log("edit called");
  //   let dialogRef = this.dialog.open(DialogOverviewMessageDialogLocation, {
  //     data: { event }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //     this.getallLocations();
  //   });
  // }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(send_gift_card, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getallGiftAssign();

      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallGiftAssign() {
    ////console.log("here inside conact details");

    var url = `${this.baseUrl}getAllgiftPrice`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    });
  }
  ////////////////////delete Dialoge///////////////////
  // OpenDelete(id): void {

  //   //console.log("************:" + id)

  //   let dialogRef = this.dialog.open(DeletedialogLocation, {
  //     data: { name: "" }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //     this.delresult = result;
  //     if (this.delresult == "1")
  //       this.deleteLocation(id);
  //   });
  // }
}

@Component({
  templateUrl: "send_gift_card.html",
})
export class send_gift_card {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  myControl1 = new FormControl();
  options1: any = [];

  myControl2 = new FormControl();
  options2: any = [];

  myControl3 = new FormControl();
  options3: any = [];

  filteredOptions1: Observable<string[]>;
  filteredOptions2: Observable<string[]>;
  filteredOptions3: Observable<string[]>;

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

  team_namet = "";
  player_namet = "";

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
    this.checkuserlogin();
    this.getallLocation();
    this.getAllPlayers();
    this.getAllCodeMoney();
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 1500);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
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
  public dataSourceAllGift: any;
  public dataSourceCircuit: any;
  public dataSourcePlayers: any;
  public dataSourcePlayersDetails: any;

  public dataSourceLeaderboard: any;
  public dataSourceTeamDataAnalysis: any;
  private readonly baseUrl = environment.baseUrl;
  public dailyMiles: any;
  public weeklyMiles: any;
  public monthlyMiles: any;
  public points = "";
  public device_token = "";
  public device_type = "";
  public location_id = "";
  public circuit_id = "";
  public team_id = "";
  //public location_name = '';
  public team_name = "0";
  public player_id = "";
  public gift_id = "";
  public player_id2 = "";
  public player_name = "";
  public player_email = "";
  public player_team = "";
  public spinner: any;

  public is_all = true;

  getallLocation() {
    var url = `${this.baseUrl}getTeamAdmin`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];

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

  getAllCodeMoney() {
    this.dataSourceAllGift = [];

    var url = `${this.baseUrl}getAllCodeMoney`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceAllGift = data["response"];
    });
  }

  get_team_id(res) {
    this.player_name = "";
    this.player_email = "";
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
          //console.log(value);
          this.get_player_id(value);
          return this._filter(value);
        })
      );

      this.is_all = false;

      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');

      //console.log(this.dataSourcePlayers);
      //this.dataSource2 = [];
      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');
    });
  }

  get_player_id(res) {
    this.points = "";
    this.player_name = "";
    this.player_email = "";
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
      this.player_team = this.dataSourcePlayersDetails[0].team_name;
      this.device_token = this.dataSourcePlayersDetails[0].device_token;
      this.device_type = this.dataSourcePlayersDetails[0].device_type;
      this.circuit_id = this.dataSourcePlayersDetails[0].circuit_id;
      this.location_id = this.dataSourcePlayersDetails[0].location_id;
      this.team_id = this.dataSourcePlayersDetails[0].team_id;
      this.player_id = this.dataSourcePlayersDetails[0].player_id;
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

  onSubmit(data) {
    var check1 = 1;
    var check3 = 1;
    data["player_id"] = this.player_id;

    if (data.player_id == "" || typeof data.player_id == "undefined") {
      check1 = 0;
    }
    // if (data.player_id2 == '' || typeof data.player_id2 == 'undefined') {
    // 	check2 = 0;
    // }
    if (data.gift_id == "" || typeof data.gift_id == "undefined") {
      check3 = 0;
    }

    if (check1 == 1 && check3 == 1) {
      //console.log('valid');
    } else {
      //console.log('invalid');

      this.snackBar.open(
        "Please select player and/or Enter valid points",
        null,
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "red-snackbar",
        }
      );
      return false;
    }

    //console.log('>>>>>>>>>>>>>')
    //console.log(data);
    //console.log('>>>>>>>>>>>>>')

    var url = `${this.baseUrl}assignPlayerGiftCard`;

    this.ajaxService.post(data, url).subscribe((data) => {
      // this.player_name = '';
      // this.player_email = '';
      // this.player_team = '';
      // this.device_token = '';
      // this.device_type ='';
      // this.circuit_id = '';
      // this.location_id = '';
      // this.team_id = '';
      // this.team_name = '0';
      // this.player_id = '';
      // this.gift_id = '';
      // this.player_id2 = '';
      // this.points = '';
      // this.is_all = true;
      // this.getAllPlayers();

      if (data["status"] == "true") {
        //console.log('ok');
        this.snackBar.open("Points send successfully", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "blue-snackbar",
        });
      } else {
        //console.log('not ok');
        this.snackBar.open("Points not send successfully", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: "blue-snackbar",
        });
      }

      this.dialogRef.close();
    });
  }
}
