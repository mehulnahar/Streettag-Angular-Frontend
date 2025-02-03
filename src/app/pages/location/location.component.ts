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

// import {DeletedialogLocation} from '../../DeletedialogLocation/DeletedialogLocation.component';

//declare var $:any;

// Add interface for Location response
interface LocationResponse {
  response: Location[];
}

interface Location {
  id: string;
  location_name: string;
  created_at: string;
}

@Component({
  selector: "app-event",
  templateUrl: "./Location.component.html",
  styleUrls: ["./Location.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class LocationComponent implements OnInit {
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
  public form!: FormGroup;
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
    "location_name",
    "created_at",
    "edit",
  ];
  public dataSource: any;

  lastelementData: any;

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getallLocations();

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
  openEditDialog(event:any): void {
    //console.log(event);

    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewMessageDialogLocation, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallLocations();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogLocation, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallLocations();

      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallLocations() {
    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get<LocationResponse>(url).subscribe(
      (data) => {
        // Transform the dates to a format Angular can understand
        const transformedData = data.response.map(location => ({
          ...location,
          created_at: this.transformDate(location.created_at)
        }));
        this.dataSource = new MatTableDataSource<Location>(transformedData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open("Session Timed Out! Please Login", undefined, {
            duration: 1700,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  private transformDate(dateStr: string): string {
    if (!dateStr) return '';
    // Convert from DD-MM-YYYY to YYYY-MM-DD
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  ////////////////////delete Dialoge///////////////////
  OpenDelete(id:any): void {
    //console.log("************:" + id)

    let dialogRef = this.dialog.open(DeletedialogLocation, {
      data: { name: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.delresult = result;
      if (this.delresult == "1") this.deleteLocation(id);
    });
  }

  deleteLocation(Location_id:any) {
    //console.log("id:" + Location_id)

    var getdata = {};
    var url = `${this.baseUrl}deleteLocation`;
    var data = { location_id: Location_id };

    //console.log("data 89889 : ", data)
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallLocations();
        ////console.log("result is:");

        ////console.log(this.resData);
        this.snackBar.open("Location deleted Successfully!", undefined, {
          duration: 3000,
          verticalPosition: "top",
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
    // this. getLink();
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogLocation {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public settings!: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogLocation>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      location_name: ['', Validators.required]
    });
  }
  
  groups = this.data;
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get<LocationResponse>(url).subscribe(
      (data) => {
        const transformedData = data.response.map(location => ({
          ...location,
          created_at: this.transformDate(location.created_at)
        }));
        this.dataSource = new MatTableDataSource<Location>(transformedData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open("Session Timed Out! Please Login", undefined, {
            duration: 1700,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  private transformDate(dateStr: string): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  addevent() {
    if (this.form.valid) {
      var url = `${this.baseUrl}addLocation`;
      var data1 = {
        location_name: this.form.get('location_name')?.value,
      };

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        this.getallLocations();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.addevent();
    }
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogLocation {
  allLocations = [] as any;
  form: FormGroup;
  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_id = "";
  public zoom: number = 7;
  public settings!: Settings;
  resData = [] as any;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogLocation>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      location_name: [this.data.event.location_name, Validators.required]
    });
    this.location_id = this.data.event.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateevent() {
    if (this.form.valid) {
      var url = `${this.baseUrl}editLocation`;
      var data1 = {
        location_id: this.location_id,
        location_name: this.form.get('location_name')?.value,
        location_name_old: this.data.event.location_name,
      };

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: "top",
        });
        this.dialogRef.close();
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.updateevent();
    }
  }
}

@Component({
  selector: "app-blank",
  templateUrl: "./DeletedialogLocation.dialog.html",
})
export class DeletedialogLocation {
  constructor(
    public dialogRef: MatDialogRef<DeletedialogLocation>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(x:any) {
    this.dialogRef.close(x);
  }
}
