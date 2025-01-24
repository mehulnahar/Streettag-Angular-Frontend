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

@Component({
  selector: "app-sponsor",
  templateUrl: "./sponsor.component.html",
  styleUrls: ["./sponsor.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class SponsorComponent implements OnInit {
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
  public zoom: number = 15;
  public displayedColumns = [
    "id",
    "sponsor_name",
    "sponsor_image",
    "sponsor_image2",
    "diameter",
    "edit",
    "delete",
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

    // $('#spinner').show();

    // var thisone = this;
    //          setTimeout(function(){
    //           thisone.getMsggroups()
    //           thisone.getgroupList()
    //           thisone.getallSponsor()
    //           thisone.viewDetail(this.glist);
    //      $('#spinner').hide();
    //     },2000);

    this.getallSponsor();
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



  ////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    let dialogRef = this.dialog.open(DialogEditSponsor, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallSponsor();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddSponsor, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallSponsor();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getallSponsor() {
       const url = `${this.baseUrl}getSponsors`;
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete ${data.sponsor_name} sponsor?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteSponsor(data.id);
      }
    });
  }


  deleteSponsor(id) {
    var getdata = {};
    var url = `${this.baseUrl}deleteSponsor`;
    var data = { sponsor_id: id };

    this.ajaxService.post(data, url).subscribe((data) => {
      this.resData = data;
      this.getallSponsor();

      this.snackBar.open(" deleted Successfully!", null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ["blue-snackbar"],

      });
    });
  }
}

@Component({
  templateUrl: "sponsor_add_modal.component.html",
})
export class DialogAddSponsor {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public lat: number = 22.69310334966885;
  public lng: number = 75.8820695508789;
  public zoom: number = 12;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  tag_image: any;
  tag_image2: any;
  public showMap = true;
  public tagLatings: any;
  public sponsorLatings: any;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddSponsor>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    this.getAllSponserInsideDiameter();
  }
  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getAllSponserInsideDiameter() {
    var url = `${this.baseUrl}getAllSponserInsideDiameter`;
    var data1 = {
      diameter: "1000",
      lat: this.lat,
      lng: this.lng,
    };

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.sponsorLatings = data["response"];
    });
  }

  getAllSponserInsideDiameter2(lat, lng) {
    var url = `${this.baseUrl}getAllSponserInsideDiameter`;
    var data1 = {
      diameter: this.tagDiameter,
      lat: this.lat,
      lng: this.lng,
    };

    if (data1.diameter == "") {
      data1.diameter = "0";
    }

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.showMap = false;
      this.sponsorLatings = data["response"];
    });
  }

  public tagDiameter = "500";
  getDiameter(e) {
    this.tagDiameter = e.target.value;
    //this.tagInsideDiameter(this.lat, this.lng);
    this.getAllSponserInsideDiameter2(this.lat, this.lng);
  }
  Number(val) {
    return parseInt(val);
  }

  tagInsideDiameter(lat, lng) {
    var url = `${this.baseUrl}getTagsInsideDiameter`;
    var data1 = {
      diameter: this.tagDiameter,
      lat: this.lat,
      lng: this.lng,
    };

    if (data1.diameter == "") {
      data1.diameter = "0";
    }

    this.ajaxService.post(data1, url).subscribe((data1) => {
      this.showMap = false;
      this.tagLatings = data1["response"];
    });
  }

  getallSponsor() {
    var getdata = {};

    var url = `${this.baseUrl}getSponsors`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);

      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      sponsor_name: ["", Validators.required],
      lat: [this.lat, Validators.required],
      lng: [this.lng, Validators.required],
      diameter: ["500", Validators.required],
    });
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.angForm.patchValue({ lat: this.lat, lng: this.lng });
    //this.tagInsideDiameter(this.lat, this.lng)
    this.getAllSponserInsideDiameter2(this.lat, this.lng);
  }

  setlocation(res) {
    //this.location=this.location;

    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      res +
      "&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8";

    this.ajaxService.getLocation(url).subscribe((data: any) => {
      if (
        typeof data != "undefined" &&
        data != "" &&
        typeof data.results != "undefined" &&
        data.results != ""
      ) {
        var lattitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;

        this.lat = lattitude;
        this.lng = longitude;

        this.angForm.patchValue({ lat: this.lat, lng: this.lng });
        //this.tagInsideDiameter(this.lat, this.lng)
        this.getAllSponserInsideDiameter2(this.lat, this.lng);
      }
    });
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.tag_image = reader.result;
  }

  handleInputChange2(e) {
    //alert('hello');
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded2.bind(this);
    reader.readAsDataURL(file);
    ////console.log(file);
  }
  _handleReaderLoaded2(e) {
    let reader = e.target;
    this.tag_image2 = reader.result;
  }

  //addevent(data) {
  addevent() {
    if (typeof this.tag_image == "undefined") {
      this.snackBar.open("Please select before scan image", null, {
        duration: 2000,
        verticalPosition: "top",
      });
      return false;
    }

    if (typeof this.tag_image2 == "undefined") {
      this.tag_image2 = "";
    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}addSponsors`;
      var data1 = {
        sponsor_name: this.angForm.value.sponsor_name,
        lat: this.angForm.value.lat,
        lng: this.angForm.value.lng,
        tag_image: this.tag_image,
        tag_image2: this.tag_image2,
        diameter: this.angForm.value.diameter,
      };

      //console.log('#####################################')
      //console.log(data1);
      //console.log('#####################################')

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;

        this.getallSponsor();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}

@Component({
  templateUrl: "sponsor_edit_modal.component.html",
})
export class DialogEditSponsor {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //public lat: number = 48.421530;
  //public lng: number = -75.697193;
  public lat = this.data.event.lat;
  public lng = this.data.event.lng;
  public old_lat = this.data.event.lat;
  public old_lng = this.data.event.lng;
  public diameter = this.data.event.diameter;
  public zoom: number = 12;
  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  tag_image = this.data.event.tag_image;
  tag_image2 = this.data.event.tag_image2;
  public sponsorLatings: any;
  public tagDiameter = this.data.event.diameter;
  public showMap = true;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddSponsor>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    this.getAllSponserInsideDiameter();
    //console.log('%%%%%%%%%% tag image %%%%%%%%%%')
    //console.log(this.tag_image)
    //console.log('%%%%%%%%%%  tag image2 %%%%%%%%%%')
    //console.log(this.tag_image2)
    //console.log('%%%%%%%%%%%%%%%%%%%%')
  }

  getAllSponserInsideDiameter() {
    var url = `${this.baseUrl}getAllSponserInsideDiameter`;
    var data1 = {
      diameter: "1000",
      lat: this.lat,
      lng: this.lng,
    };

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.sponsorLatings = data["response"];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallSponsor() {
    var getdata = {};

    var url = `${this.baseUrl}getSponsors`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      sponsor_name: [this.data.event.sponsor_name, Validators.required],
      lat: [this.data.event.lat, Validators.required],
      lng: [this.data.event.lng, Validators.required],
      diameter: [this.data.event.diameter, Validators.required],
    });
  }

  getDiameter(e) {
    this.tagDiameter = e.target.value;

    //this.tagInsideDiameter(this.lat, this.lng);
    this.getAllSponserInsideDiameter2(this.lat, this.lng);
  }
  getAllSponserInsideDiameter2(lat, lng) {
    var url = `${this.baseUrl}getAllSponserInsideDiameter`;
    var data1 = {
      diameter: this.tagDiameter,
      lat: this.lat,
      lng: this.lng,
    };

    if (data1.diameter == "") {
      data1.diameter = "0";
    }

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.sponsorLatings = data["response"];
      this.showMap = false;
    });
  }

  Number(val) {
    return parseInt(val);
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.angForm.patchValue({ lat: this.lat, lng: this.lng });
    this.getAllSponserInsideDiameter2(this.lat, this.lng);
  }

  setlocation(res) {
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      res +
      "&key=AIzaSyB9stNP2UYOkJCJkR2CfnabPiNP6g08UH8";

    this.ajaxService.getLocation(url).subscribe((data: any) => {
      if (
        typeof data != "undefined" &&
        data != "" &&
        typeof data.results != "undefined" &&
        data.results != ""
      ) {
        var lattitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;

        this.lat = lattitude;
        this.lng = longitude;

        this.angForm.patchValue({ lat: this.lat, lng: this.lng });
        this.getAllSponserInsideDiameter2(this.lat, this.lng);
      }
    });
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.tag_image = reader.result;
  }

  handleInputChange2(e) {
    //alert('hello');
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded2.bind(this);
    reader.readAsDataURL(file);
    ////console.log(file);
  }
  _handleReaderLoaded2(e) {
    let reader = e.target;
    this.tag_image2 = reader.result;
  }

  updateevent() {
    if (typeof this.tag_image == "undefined") {
      this.snackBar.open("Please select image", null, {
        duration: 2000,
        verticalPosition: "top",
      });
      return false;
    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editSponsors`;
      var data1 = {
        id: this.data.event.id,
        sponsor_name: this.angForm.value.sponsor_name,
        lat: this.angForm.value.lat,
        lng: this.angForm.value.lng,
        tag_image: this.tag_image,
        tag_image2: this.tag_image2,
        diameter: this.angForm.value.diameter,
      };

      //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
      //console.log(data1);
      //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        this.getallSponsor();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}

