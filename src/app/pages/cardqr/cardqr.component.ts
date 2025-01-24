import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
// import { ExcelService } from "../../excel.service";
import { environment } from "src/environments/environment";



@Component({
  selector: "app-cardqr",
  templateUrl: "./cardqr.component.html",
  styleUrls: ["./cardqr.component.scss"],
  encapsulation: ViewEncapsulation.None,
})

export class CardqrComponent implements OnInit {


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

  public displayedColumns = [
    "serial_number",
    "card_name",
    "fruit_name",
    "score",
    // "totalScans",
    "qr_code_path",
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getFruitQrCards();
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
  openEditDialog(): void {
    alert("work under process...");
    // let dialogRef = this.dialog.open(DialogEditKingstone, {
    // 	data: { event }
    // });

    // dialogRef.afterClosed().subscribe(result => {

    // 	this.getFruitQrCards();
    // });
  }

  // to open add dialog
  openAddMessageDialog(): void {
    let dialogRef = this.dialog.open(DialogCardqr, {
      data: { groups: this.groupList.result },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getFruitQrCards();
      this.toggle();
    });
  }
  

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }


  getFruitQrCards() {

    var url = `${this.baseUrl}getFruitCardData`;

    this.ajaxService.get(url).subscribe((data) => {

      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }


}




@Component({
  templateUrl: "cardqr-add-model.html",
})

export class DialogCardqr implements OnInit {

  public sidenavOpen: boolean = true;

  @HostListener("window:resize")

  public onWindowResize(): void {
    window.innerWidth <= 992
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }

    this.getFruitQrCards();
    this.getAllFruits();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.dataSource.paginator = this.paginator;
  //   }, 1500);
  //   setTimeout(() => {
  //     this.dataSource.sort = this.sort;
  //   }, 3000);
  // }

  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  public settings: Settings;
  form: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  location_id = 27;
  fruit_id = 39;
  
  public spinner:Boolean = false;

  public dataSource : any;
  public dataSourceFruits: any;

  private readonly baseUrl = environment.baseUrl;

  angForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCardqr>,
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


  getAllFruits() {
    var getdata = {};
    // var url = `${this.baseUrl}getSchoolCircuits`;
    var url = `${this.baseUrl}getAllFruit`;

    var data = {};
    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceFruits = data["response"];
    });
  }

  getFruitQrCards() {

    var url = `${this.baseUrl}getFruitCardData`;

    this.ajaxService.get(url).subscribe((data) => {

      this.dataSource = new MatTableDataSource<Element>(data["response"]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  createForm() {
    this.angForm = this.fb.group({
      card_name: ["", Validators.required],
      fruit_id : ['', Validators.required],
    });
  }

  addevent() {

    if (this.angForm.status == "VALID") {

      this.spinner = true;
                    
      var card_name1 = this.angForm.value.card_name;
          card_name1 = card_name1.replace("'", "`");  

      var url = `${this.baseUrl}addFruitCard`;

      var data1 = {
        card_name: card_name1,
        fruit_id: this.fruit_id
      };

      this.ajaxService.post(data1, url).subscribe((data1) => {
        if (data1["status"] == "true") {
            this.snackBar.open("Fruit Card Qr Successfully generated", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "blue-snackbar",
            });
          this.spinner = false;
        }else{
          this.snackBar.open("Something went wrong!", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: "red-snackbar",
          });
         this.spinner = false;
        }

        this.getFruitQrCards();
        this.dialogRef.close();
      });
    }
  }
}

