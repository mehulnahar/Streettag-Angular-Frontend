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
  selector: "app-event",
  templateUrl: "./Circuit.component.html",
  styleUrls: ["./Circuit.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class CircuitComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;

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
    "serial_number",
    "circuit_name",
    "location_name",
    "start_date",
    "end_date",
    "edit",
  ];
  public dataSource: any;
  public dataSourceLocation: any;
  public selectedValue: string;
  public picker1;
  public picker2;
  public foods = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
  ];
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

    // $('#spinner').show();

    // var thisone = this;
    //          setTimeout(function(){
    //           thisone.getMsggroups()
    //           thisone.getgroupList()
    //           thisone.getallCircuits()
    //           thisone.viewDetail(this.glist);
    //      $('#spinner').hide();
    //     },2000);

    this.getallCircuits();

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

  // public viewDetail(mail){
  //   this.mail = this.mailboxService.getMail(mail.id);
  //   this.mails.forEach(m => m.selected = false);
  //   this.mail.selected = true;
  //   this.mail.unread = false;
  //   this.newMail = false;
  //   if(window.innerWidth <= 992){
  //     this.sidenav.close();
  //   }
  // }

  ////////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    //event.location = this.dataSourceLocation;
    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewMessageDialogCircuit, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog();
      //  this.getMsggroups();

      //  this.getallevent();
      //  this.viewDetail(result);
      //  this.toggle();
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddMessageDialogCircuit, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////console.log('The dialog was closed');
      //  this.name = result;
      //this.openDialog()

      this.getallCircuits();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  // getallLocations(){
  //   ////console.log("here inside conact details");
  //   alert(11111111);
  //   var getdata = {};

  //   var url = `${this.baseUrl}getLocations`;

  //   var data = {};

  //   this.ajaxService.get( url).subscribe(
  //     data => {

  //       //console.log(900000000);
  //       //console.log(data['response']);

  //       this.dataSourceLocation =  data['response'];

  //     })

  // }
  ///////////////get all event//////////////////
  getallCircuits() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getCircuits`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
      //console.log(data);
      //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')

      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      // //console.log("all Locations:");
      // //console.log(this.dataSource)

      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    });
  }
  ////////////////////delete Dialoge///////////////////
  // OpenDelete(id): void {

  //   //console.log("************:" + id)

  //   let dialogRef = this.dialog.open(DeletedialogCircuit, {
  //     data: { name: "" }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //     this.delresult = result;
  //     if (this.delresult == "1")
  //       this.deleteCircuit(id);
  //   });
  // }

  deleteCircuit(circuit_id) {
    var getdata = {};
    var url = `${this.baseUrl}deleteCircuit`;
    var data = { circuit_id: circuit_id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        ////console.log("result is:");

        ////console.log(this.resData);
        this.snackBar.open("Circuit deleted Successfully!", null, {
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
export class DialogOverviewAddMessageDialogCircuit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  circuit_name = "";
  //no_of_QR = '';
  start_date = "";
  end_date = "";
  public dataSourceLocation: any;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogCircuit>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
    this.getallLocations();
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallCircuits() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getCircuits`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log("all Locations:");
      //console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getallLocations() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getLocations`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      //console.log(545454545454);
      //console.log(this.dataSourceLocation);
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      circuit_name: ["", [Validators.required]],

      location_name: ["", Validators.required],
      // no_of_QR: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
    });
  }

  addevent() {
    if (this.angForm.status == "VALID") {
      //console.log(this.angForm.status);

      var url = `${this.baseUrl}addCircuit`;
      var data1 = {
        location_name: this.location_name,
        circuit_name: this.circuit_name,
        //"no_of_QR": this.no_of_QR,
        start_date: this.start_date,
        end_date: this.end_date,
      };
      //console.log("request parameter is:")
      //console.log(data1)

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)
        this.getallCircuits();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogCircuit {
  allLocations = [] as any;
  form: FormGroup;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_name = "";
  circuit_name = "";
  circuit_id = "";
  location_id = "";
  //no_of_QR = '';
  start_date = "";
  end_date = "";
  resData: any;
  public dataSourceLocation: any;

  selectedValue: string;

  public zoom: number = 7;
  public settings: Settings;

  angForm: FormGroup;

  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogCircuit>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    this.location_name = this.data.event.location_name;
    this.circuit_name = this.data.event.circuit_name;
    this.circuit_id = this.data.event.id;
    this.location_id = this.data.event.location_id;
    //this.no_of_QR = this.data.event.no_of_QR;
    this.start_date = this.data.event.start_date;
    this.end_date = this.data.event.end_date;

    this.getallLocations();
    //console.log("saeeeeeee");
    //console.log(this.data.event);

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getLocations`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      //console.log(545454545454);
      //console.log(this.dataSourceLocation);
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      circuit_name: ["", Validators.required],
      location_name: ["", Validators.required],
      // no_of_QR: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
    });
  }

  updateevent() {
    if (this.angForm.status == "VALID") {
      //console.log(this.angForm.status);

      var url = `${this.baseUrl}editCircuit`;
      var data1 = {
        circuit_id: this.circuit_id,
        circuit_name: this.circuit_name,
        location_name: this.location_name,
        // "no_of_QR": this.no_of_QR,
        start_date: this.start_date,
        end_date: this.end_date,
      };
    
      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        //console.log(this.resData)

        this.snackBar.open(this.resData.msg, null, {
          duration: 3000,
          verticalPosition: "top",
        });

        this.dialogRef.close();
      });
    }
  }

  closeDialog(group) {
    this.dialogRef.close(group);
  }
}

@Component({
  selector: "app-blank",
  templateUrl: "./DeletedialogCircuit.dialog.html",
})
export class DeletedialogCircuit {
  constructor(
    public dialogRef: MatDialogRef<DeletedialogCircuit>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(x) {
    this.dialogRef.close(x);
  }
}
