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
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";
import { pluck } from "rxjs/operators/pluck";
import { Observable } from "rxjs";

// import {DeletedialogLocation} from '../../DeletedialogLocation/DeletedialogLocation.component';

//declare var $:any;
@Component({
  selector: "app-event",
  templateUrl: "./opportunities.component.html",
  styleUrls: ["./opportunities.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class OpportunitiesComponent implements OnInit {
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
    "likes",
    "dislikes",
    "opportunity_data",
    "opportunity_image",
    "opportunity_link",
    "circuits",
    "created_at",
    "edit",
    "delete",
  ]; //'serial_number',
  public dataSource: any;
  public dataSourceLocation: any;
  public selectedValue: string;
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
    //console.log(event);

    //console.log("edit called");
    let dialogRef = this.dialog.open(DialogOverviewMessageDialogOpportunities, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallCircuits();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(
      DialogOverviewAddMessageDialogOpportunities,
      {
        data: { groups: this.groupList.result },
      }
    );

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

  getallLocations() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getLocations`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
    });
  }
  ///////////////get all event//////////////////
  getallCircuits() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getOpportunities`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      //console.log("all Locations:");
      //console.log(this.dataSource);

      this.dataSource.paginator = this.paginator;
    });
  }
 
  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this opportunity?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteCircuit(id)
      }
    });
  }

  deleteCircuit(circuit_id) {
    var getdata = {};
    var url = `${this.baseUrl}deleteOpportunity`;
    var data = { circuit_id: circuit_id };

    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        this.getallCircuits();
        this.snackBar.open("Opportunity deleted Successfully!", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        //console.error("Error");
      }
    );
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addmessage-dialog.html",
})
export class DialogOverviewAddMessageDialogOpportunities {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

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
  opportunity_data = "";
  opportunity_link = "";
  location_val: any;
  blank_arr: any;
  i: any;

  angForm: FormGroup;

  public dataSourceLocation: any;
  public dataSourceCircuit: any;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  public imageSrc: any;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogOpportunities>,
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
    this.getallCircuits();
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
      //dataSource = data['response'];
      this.dataSourceCircuit = data["response"];
      //console.log("all Locations:");
      //console.log(this.dataSource)
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
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      opportunity_data: ["", [Validators.required]],
      circuit_name: ["", [Validators.required]],
    });
  }

  addevent() {
    //console.log(this.angForm.status);

    if (this.angForm.status == "VALID") {
      //alert(this.opportunity_data);

      var str = this.opportunity_data;

      for (var k = 0; k < str.length; k++) {
        str = str.replace('"', "`");

        if (k == str.length - 1) {
          this.opportunity_data = str;
        }
      }

      //this.opportunity_data = str.replace('"', "'");
      //alert(this.opportunity_data);
      //return false;
      var url = `${this.baseUrl}addOpportunity`;
      var data1 = {
        //"locations": this.location_name,
        circuits: this.circuit_name,
        opportunity_data: this.opportunity_data,
        opportunity_image: this.imageSrc,
        opportunity_link: this.opportunity_link,
      };


      var circuit_id_arr = [];
      var circuit_id_str = "";

      this.dataSourceCircuit.forEach(function (item, index) {
        for (var i = 0; i < data1.circuits.length; i++) {
          if (data1.circuits[i] == item.circuit_name) {
            circuit_id_arr[i] = item.id;
          }
        }
      });

      circuit_id_str = circuit_id_arr.join();

      var data2 = {
        // "locations": this.location_name,
        circuits: this.circuit_name,
        opportunity_data: this.opportunity_data,
        opportunity_image: this.imageSrc,
        opportunity_link: this.opportunity_link,
        //"location_ids": location_id_str,
        circuit_ids: circuit_id_str,
      };

      //console.log(data2);

      this.ajaxService.post(data2, url).subscribe((data2) => {
        this.resData = data2;
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

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    //console.log(this.imageSrc)
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-message-dialog.html",
})
export class DialogOverviewMessageDialogOpportunities {
  allLocations = [] as any;
  form: FormGroup;

  public lat: number = 45.42153;
  public lng: number = -75.697193;
  location_name = "";
  location_name_arr = [] as any;
  circuit_name_arr = [] as any;
  circuit_name = "";
  circuit_id = "";
  location_id = "";
  no_of_QR = "";
  start_date = "";
  end_date = "";
  opportunity_data = "";
  opportunity_link = "";
  opportunity_image = "";
  test = "";
  location_arr = [] as any;
  circuit_arr = [] as any;
  resData: any;

  public dataSourceLocation: any;
  public dataSourceCircuit: any;

  selectedValue: string;

  public zoom: number = 7;
  public settings: Settings;

  angForm: FormGroup;

  public imageSrc: any;

  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogOpportunities>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();

    //console.log('all edit data');
    //console.log(this.data.event);

    this.opportunity_data = this.data.event.opportunity_data;
    this.opportunity_link = this.data.event.opportunity_link;
    this.opportunity_image = this.data.event.opportunity_image;
    this.location_arr = this.data.event.locations.split(",");
    this.circuit_id = this.data.event.id;
    //console.log(this.location_arr);
    this.test = "test tes";
    this.location_name_arr = this.location_arr;

    this.circuit_arr = this.data.event.circuits.split(",");
    this.circuit_name_arr = this.circuit_arr;

    this.getallCircuits();
    this.getallLocations();

    this.form = this.formBuilder.group({
      message: ["", Validators.required],
      group: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallCircuits() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}getCircuits`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSourceCircuit = data["response"];
      //console.log("all Locations:");
      //console.log(this.dataSource)
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
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      opportunity_data: ["", [Validators.required]],

      //opportunity_link: ['', [Validators.required]],
      //location_name: ['', [Validators.required]],
      circuit_name: ["", [Validators.required]],
    });
  }

  updateevent() {
    //console.log('testesest');

    var url = `${this.baseUrl}editOpportunity`;

    if (typeof this.imageSrc == "undefined") {
      this.imageSrc = "not selected";
    }

    var str = this.opportunity_data;

    for (var k = 0; k < str.length; k++) {
      str = str.replace('"', "`");

      if (k == str.length - 1) {
        this.opportunity_data = str;
      }
    }

    var data1 = {
      opportunity_id: this.circuit_id,
      //"locations": this.location_name_arr,
      circuits: this.circuit_name_arr,
      opportunity_data: this.opportunity_data,
      opportunity_image: this.imageSrc,
      opportunity_link: this.opportunity_link,
    };

    var circuit_id_arr = [];
    var circuit_id_str = "";

    this.dataSourceCircuit.forEach(function (item, index) {
      for (var i = 0; i < data1.circuits.length; i++) {
        if (data1.circuits[i] == item.circuit_name) {
          circuit_id_arr[i] = item.id;
        }
      }
    });

    circuit_id_str = circuit_id_arr.join();

    var data2 = {
      opportunity_id: this.circuit_id,
      //"locations": this.location_name_arr,
      circuits: this.circuit_name_arr,
      opportunity_data: this.opportunity_data,
      opportunity_image: this.imageSrc,
      opportunity_link: this.opportunity_link,
      circuit_ids: circuit_id_str,
    };

    //console.log("request parameter is:")
    //console.log('edit params-----------------');
    //console.log(data1);

    this.ajaxService.post(data2, url).subscribe((data1) => {
      this.resData = data1;
      this.snackBar.open(this.resData.msg, null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["blue-snackbar"],
      });

      this.dialogRef.close();
    });
  }

  closeDialog(group) {
    this.dialogRef.close(group);
  }

  handleInputChange(e) {
    //console.log('inpupt handle')
    //console.log(e);
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      // ('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    //console.log(this.imageSrc)
  }
}


