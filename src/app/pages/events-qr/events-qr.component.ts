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
import { environment } from "src/environments/environment";

@Component({
  selector: "app-events-qr",
  templateUrl: "./events-qr.component.html",
  styleUrls: ["./events-qr.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class EventsQRComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

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
  // public lat: number = 45.421530;
  // public lng: number = -75.697193;
  public default_lat = 20.593684;
  public default_lng = 78.96288;
  //public default_lat = 45.421530;
  public zoom: number = 2;
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

  public lat: number;
  public lng: number;
  public diameter: number;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.getAllTags();
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
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  getallConsents() {
    var getdata = {};

    var url = `${this.baseUrl}getConsents`;

    var data = {};

    //console.log(url);

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
    });
  }

  public dataSourceLocation: any;
  public dataSourceCircuit: any;
  public dataSourceLeaderboard: any;
  public dataSourceTeamDataAnalysis: any;

  public dailyMiles: any;
  public weeklyMiles: any;
  public monthlyMiles: any;

  public location_id: any;
  public circuit_id: any;
  public location_name = "";
  public circuit_name = "";
  public spinner: any;
  public showmap1 = true;
  public showmap2 = false;

  getallLocation() {
    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      //console.log('>>>>>>>>>>>>>>>>>>>');
      //console.log(this.dataSourceLocation);
      //console.log('>>>>>>>>>>>>>>>>>>>');
    });
  }

  get_location_id(res) {
    var url = `${this.baseUrl}getCircuitByLocation`;

    var data1 = {
      location_id: res,
    };

    this.circuit_id = "";
    this.circuit_name = "";

    if (data1.location_id == "") {
      return false;
    }

    this.location_id = res;

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.dataSourceCircuit = data["response"];

      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');
      //console.log(this.dataSourceCircuit);
      this.dataSource2 = [];
      //console.log('<<<<<<<<>>>>>>>>>>>>>>>>>>>>');
    });
  }

  public allTags;
  getAllTags() {
    var url = `${this.baseUrl}getAllTags`;

    this.ajaxService.get(url).subscribe((data) => {
      this.allTags = data["response"];
      //console.log(data['response']);
    });
  }

  public allTags2;
  public selected_lat;
  public selected_lng;
  onSubmit(data) {
    //console.log(data);

    var url = `${this.baseUrl}getTagsInsideDiameter`;
    var data1 = {
      diameter: data.diameter,
      lat: data.lat,
      lng: data.lng,
    };

    this.selected_lat = data.lat;
    this.selected_lng = data.lng;
    this.selected_lat = parseFloat(this.selected_lat);
    this.selected_lng = parseFloat(this.selected_lng);

    //console.log('$$$$$$$$$$$$$$$$')
    //console.log(this.selected_lat)
    //console.log(this.selected_lng)
    //console.log('$$$$$$$$$$$$$$$$')

    this.ajaxService.post(data1, url).subscribe((data1) => {
      this.allTags2 = data1["response"];
      //console.log('********************')
      //console.log(this.allTags2)
      //console.log('********************')

      this.showmap1 = false;
      this.showmap2 = true;
    });
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }
}
