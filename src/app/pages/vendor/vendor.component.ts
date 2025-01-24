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
  selector: "app-vendor",
  templateUrl: "./vendor.component.html",
  styleUrls: ["./vendor.component.scss"],
  encapsulation: ViewEncapsulation.None,
 })
export class VendorComponent implements OnInit {
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
    "vendor_name",
    "address",
    "image",
    "qr_code_path",
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
    this.getVendors();
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

  ////////////////open edit dialoge/////////////////////////
  openEditDialog(event): void {
    let dialogRef = this.dialog.open(DialogEditVendor, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getVendors();
    });
  }

  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogAddVendor, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getVendors();
      this.toggle();
    });
  }

  openTagDialog(event): void {
    let dialogRef = this.dialog.open(DialogTagVendor, {
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getVendors();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }
  ///////////////get all event//////////////////

  getVendors() {
    var getdata = {};

    var url = `${this.baseUrl}getVendors`; //getVendors

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      //dataSource = data['response'];
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
 
  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete ${data.vendor_name} vendor?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteVendor(data.id);
      }
    });
  }

  deleteVendor(id) {
    var getdata = {};
    var url = `${this.baseUrl}deleteVendor`;
    var data = { vendor_id: id };

    this.ajaxService.post(data, url).subscribe((data) => {
      this.resData = data;
      this.getVendors();

      let dynamicSnackColor = "blue-snackbar";
      if (this.resData.status == "false") {
        dynamicSnackColor = "red-snackbar";
      }

      this.snackBar.open(this.resData.msg, null, {
        duration: 5000,
        verticalPosition: "top",
        panelClass: dynamicSnackColor,
      });

      //this.snackBar.open(' deleted Successfully!', null, {
      //  duration: 2000,
      //  verticalPosition: 'top'
      //});
    });
  }
}

@Component({
  templateUrl: "vendor_add_modal.component.html",
})
export class DialogAddVendor {
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

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<DialogAddVendor>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  public tagDiameter = "500";

  getDiameter(e) {
    this.tagDiameter = e.target.value;
  }

  Number(val) {
    return parseInt(val);
  }

  getVendors() {
    var getdata = {};

    var url = `${this.baseUrl}getVendors`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);

      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      vendor_name: ["", Validators.required],
      lat: [this.lat, Validators.required],
      lng: [this.lng, Validators.required],
      vendor_address: ["", Validators.required],
      bonus_points: ["", Validators.required],
      discount: ["", Validators.required],
    });
  }

  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.angForm.patchValue({ lat: this.lat, lng: this.lng });
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

    //    if (typeof this.tag_image2 == 'undefined') {
    //      this.tag_image2 = '';
    //    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}addVendor`;
      var data1 = {
        vendor_name: this.angForm.value.vendor_name,
        lat: this.angForm.value.lat,
        lng: this.angForm.value.lng,
        tag_image: this.tag_image,
        //      "tag_image2": this.tag_image2,
        vendor_address: this.angForm.value.vendor_address,
        bonus_points: this.angForm.value.bonus_points,
        discount: this.angForm.value.discount,
      };

      //      console.log('#####################################')
      //      console.log(data1);
      //      console.log('#####################################')

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;

        this.getVendors();
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
  templateUrl: "vendor_edit_modal.component.html",
})
export class DialogEditVendor {
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

  vendor_name = this.data.event.vendor_name;
  bonus_points = this.data.event.bonus_points;
  discount = this.data.event.discount;
  vendor_address = this.data.event.address;

  tag_image = this.data.event.image;
  tag_image2 = this.data.event.tag_image2;
  public sponsorLatings: any;
  private readonly baseUrl = environment.baseUrl;
  public showMap = true;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;
  angForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogEditVendor>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    //this.getAllSponserInsideDiameter();
    //console.log('%%%%%%%%%% tag image %%%%%%%%%%');
    //console.log(this.tag_image);
    //console.log(this.vendor_name);
    //console.log(this.vendor_address);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getVendors() {
    var getdata = {};

    var url = `${this.baseUrl}getVendors`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      vendor_name: [this.data.event.vendor_name, Validators.required],
      bonus_points: [this.data.event.bonus_points, Validators.required],
      discount: [this.data.event.discount, Validators.required],
      vendor_address: [this.data.event.address, Validators.required],
    });
  }
  // lat: [this.data.event.lat, Validators.required],
  // lng: [this.data.event.lng, Validators.required],

  Number(val) {
    return parseInt(val);
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

  updateevent() {
    if (typeof this.tag_image == "undefined") {
      this.snackBar.open("Please select image", null, {
        duration: 2000,
        verticalPosition: "top",
      });
      return false;
    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editVendor`;
      var data1 = {
        vendor_id: this.data.event.id,
        vendor_name: this.angForm.value.vendor_name,
        //  "lat": this.angForm.value.lat,
        //  "lng": this.angForm.value.lng,
        tag_image: this.tag_image,
        //  "tag_image2": this.tag_image2,
        vendor_address: this.angForm.value.vendor_address,
        bonus_points: this.angForm.value.bonus_points,
        discount: this.angForm.value.discount,
      };

      //  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
      //  console.log(data1);
      //  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        this.getVendors();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 5000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}


@Component({
  templateUrl: "vendor_tag_modal.component.html",
})
export class DialogTagVendor {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

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

  vendor_name = this.data.event.vendor_name;
  vendor_address = this.data.event.address;

  tag_image = this.data.event.image;
  tag_image2 = this.data.event.qr_code_path;
  public sponsorLatings: any;
  public showMap = true;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogTagVendor>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    //this.getAllSponserInsideDiameter();
    //console.log('%%%%%%%%%% tag image %%%%%%%%%%');
    //console.log(this.tag_image);
    //console.log(this.vendor_name);
    //console.log(this.vendor_address);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getVendors() {
    var getdata = {};

    var url = `${this.baseUrl}getVendors`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      vendor_name: [this.data.event.vendor_name, Validators.required],
      vendor_address: [this.data.event.address, Validators.required],
    });
  }
  // lat: [this.data.event.lat, Validators.required],
  // lng: [this.data.event.lng, Validators.required],

  Number(val) {
    return parseInt(val);
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

  updateevent() {
    if (typeof this.tag_image == "undefined") {
      this.snackBar.open("Please select image", null, {
        duration: 2000,
        verticalPosition: "top",
      });
      return false;
    }

    if (this.angForm.status == "VALID") {
      var url = `${this.baseUrl}editVendor`;
      var data1 = {
        vendor_id: this.data.event.id,
        vendor_name: this.angForm.value.vendor_name,
        //  "lat": this.angForm.value.lat,
        //  "lng": this.angForm.value.lng,
        tag_image: this.tag_image,
        //  "tag_image2": this.tag_image2,
        vendor_address: this.angForm.value.vendor_address,
      };

      //  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
      //  console.log(data1);
      //  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')

      this.ajaxService.post(data1, url).subscribe((data1) => {
        this.resData = data1;
        this.getVendors();
        let dynamicSnackColor = "blue-snackbar";
        if (this.resData.status == "false") {
          dynamicSnackColor = "red-snackbar";
        }
        this.snackBar.open(this.resData.msg, null, {
          duration: 5000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
}
