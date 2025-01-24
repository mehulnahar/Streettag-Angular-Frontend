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
//everey 30second reffrace page
//import 'rxjs/add/observable/interval';

@Component({
  selector: "app-cancelgift",
  templateUrl: "./cancelgift.component.html",
  styleUrls: ["./cancelgift.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class CancelgiftComponent implements OnInit {
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
    "request_id",
    "amount",
    "gift_card",
    "date",
    "action",
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

    const delay = 3000; // every 30 sec
    //Observable.interval(delay).subscribe(() => {
    this.getallLocations();
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

  OpenDelete(id): void {
    //console.log("************:" + id)

    let dialogRef = this.dialog.open(DeletedialogLocationgift, {
      data: { name: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.delresult = result;
      if (this.delresult == "1") this.deleteLocation(id);
    });
  }

  deleteLocation(GiftCard_id) {
    //console.log("id:" + GiftCard_id)

    var getdata = {};
    var url = `${this.baseUrl}deleteGiftCard`;
    var data = { id: GiftCard_id };

    //console.log("data 89889 : ", data)
    this.ajaxService.post(data, url).subscribe((data) => {
      this.resData = data;
      this.getallLocations();
      ////console.log("result is:");

      ////console.log(this.resData);
      this.snackBar.open("Gift Card deleted Successfully!", null, {
        duration: 3000,
        verticalPosition: "top",
      });
    });
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

  // openAddMessageDialog(): void {
  //   let dialogRef = this.dialog.open(create_gift_card, {
  //     data: { groups: this.groupList.result }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {

  //     this.getallLocations();

  //     this.toggle();

  //   });
  // }

  // toggle() {

  //   if (!this.show_dialog)
  //     this.show_dialog = !this.show_dialog;

  // }
  ///////////////get all event//////////////////

  getallLocations() {
    ////console.log("here inside conact details");

    var getdata = {};

    var url = `${this.baseUrl}cancelAllGift`;

    var data = {};

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Element>(data["response"][0]);
      //console.log("all gift:");
      //console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
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
  templateUrl: "DeletedialogLocation_dialog.html",
})
export class DeletedialogLocationgift {
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DeletedialogLocationgift>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  Submit(x) {
    this.dialogRef.close(x);
  }
}

// export class create_gift_card {

//   @ViewChild(MatPaginator) paginator: MatPaginator;

//   public lat: number = 45.421530;
//   public lng: number = -75.697193;
//   public zoom: number = 7;
//   public settings: Settings;
//   form: FormGroup;
//   groupList = [] as any;
//   delresult: any;
//   resData: any;
//   allLocations = [] as any;
//   location_name = '';

//   public displayedColumns = ['serialno', 'location_name', 'date', 'action'];
//   public dataSource: any;

//   angForm: FormGroup;

//   constructor(
//     public dialogRef: MatDialogRef<create_gift_card>, private fb: FormBuilder,
//     @Inject(MAT_DIALOG_DATA) public data: any, private ajaxService: AjaxService, public snackBar: MatSnackBar, public formBuilder: FormBuilder
//   ) {

//     this.createForm();

//     //this.get_request_id();

//     this.form = this.formBuilder.group({
//       'message': ['', Validators.required],
//       'group': ['', Validators.required],

//     });
//   }
//   groups = this.data;
//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   getallLocations() {
//     ////console.log("here inside conact details");

//     var getdata = {};

//     var url = "${this.baseUrl}getLocations";

//     var data = {};

//     this.ajaxService.get(url).subscribe(
//       data => {

//         //dataSource = data['response'];
//         this.dataSource = new MatTableDataSource<Element>(data['response']);
//         //console.log("all Locations:");
//         //console.log(this.dataSource)

//         this.dataSource.paginator = this.paginator;

//       })

//   }

//   public request_id = 'aaa';

//   get_request_id() {

//     var url = "${this.baseUrl}giftcard_req";

//     this.ajaxService.get(url).subscribe(
//       data1 => {

//         //console.log(data1);

//       })
//   }

//   createForm() {
//     this.angForm = this.fb.group({
//       amount: ['', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
//     });
//   }

//   public amount;
//   clicked = false;
//   addevent($event, data) {
//     $event.currentTarget.disabled = true;
//     //console.log(this.angForm.status);

//     if (this.angForm.status == "VALID") {

//       //console.log(data);

//       var url = "${this.baseUrl}giftcard_req";
//       var data1 = {
//         "amount": this.amount
//       };

//       if (this.amount > 100) {
//         this.snackBar.open('amount must be less  100', null, {
//           duration: 2000,
//           verticalPosition: 'top',
//           panelClass: 'red-snackbar'
//         });

//         return false;
//       }
//       //console.log("request parameter is:")
//       //console.log(data1)

//       this.ajaxService.post(data1, url).subscribe(
//         data1 => {

//           //console.log(data1)

//           // let dynamicSnackColor = 'blue-snackbar';
//           // if (this.resData.status == "false") {
//           //   dynamicSnackColor = 'blue-snackbar';
//           // }
//           this.snackBar.open('added succussfully', null, {
//             duration: 2000,
//             verticalPosition: 'top',
//             panelClass: 'blue-snackbar'
//           });

//           this.dialogRef.close();

//         })

//     }
//   }
// }
