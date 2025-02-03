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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

interface BuildingData {
  id: string;
  building_name: string;
  lat: number;
  lng: number;
}

@Component({
  selector: "app-building",
  templateUrl: "./building.component.html",
  styleUrls: ["./building.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class BuildingComponent implements OnInit {
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
  public displayedColumns = ["serial_number", "building_name", "edit", "delete"];
  public dataSource: MatTableDataSource<BuildingData>;

  constructor(
    public appSettings: AppSettings,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private ajaxService: AjaxService
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({
      search: ['']
    });
    this.dataSource = new MatTableDataSource<BuildingData>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    if (window.innerWidth <= 992) {
      this.sidenavOpen = false;
    }
    this.getallBuilding();
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

  openEditDialog(event: any): void {
    let dialogRef = this.dialog.open(DialogOverviewBuilding, {
      data: { event },
      width: '500px',
      height: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallBuilding();
    });
  }

  openAddDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewAddBuilding, {
      data: { groups: this.groupList.result },
      width: '500px',
      height: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getallBuilding();
      this.toggle();
    });
  }

  toggle() {
    if (!this.show_dialog) this.show_dialog = !this.show_dialog;
  }

  getallBuilding() {
    const url = `${this.baseUrl}getBuilding`;

    this.ajaxService.get(url).subscribe((response: any) => {
      this.dataSource = new MatTableDataSource<BuildingData>(response.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  confirmDialog(data: any): void {
    const message = `Are you sure you want to delete ${data.building_name} building?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.deleteBuilding(data.id);
      }
    });
  }

  deleteBuilding(id: string) {
    var url = `${this.baseUrl}deleteBuilding`;
    var data = { id: id };
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.getallBuilding();
        this.snackBar.open("Building Deleted Successfully!", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });
      },
      (error) => {
        console.error("Error deleting building:", error);
      }
    );
  }
}

@Component({
  selector: "dialog-overview-addmessage-dialog",
  templateUrl: "dialog-overview-addbuilding-dialog.html",
})
export class DialogOverviewAddBuilding implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  public lat!: number;
  public lng!: number;
  public zoom: number = 7;
  public settings!: Settings;
  form!: FormGroup;
  groupList = [] as any;
  delresult: any;
  resData: any;
  allLocations = [] as any;
  location_name = "";
  building_name = "";
  private readonly baseUrl = environment.baseUrl;

  public displayedColumns = ["serialno", "location_name", "date", "action"];
  public dataSource: any;

  angForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddBuilding>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    // Initialization code if needed
  }

  onSubmit() {
    if (this.angForm.valid) {
      this.addevent();
    }
  }

  groups = this.data;
  onNoClick(): void {
    this.dialogRef.close();
  }

  getallBuilding() {
    const url = `${this.baseUrl}getBuilding`;

    this.ajaxService.get(url).subscribe((response: any) => {
      this.dataSource = new MatTableDataSource<BuildingData>(response.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      building_name: ["", Validators.required],
      lat: ["", Validators.required],
      lng: ["", Validators.required],
    });
  }

  addevent() {
    if (this.angForm.valid) {
      const formValues = this.angForm.value;
      const url = `${this.baseUrl}addBuilding`;
      const data = {
        building_name: formValues.building_name,
        lat: formValues.lat,
        lng: formValues.lng,
      };

      this.ajaxService.post(data, url).subscribe((response: any) => {
        this.resData = response;
        this.getallBuilding();
        
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
    } else {
      this.snackBar.open("Please fill all required details", undefined, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    }
  }
}

@Component({
  selector: "dialog-overview--dialog",
  templateUrl: "dialog-overview-building-dialog.html",
})
export class DialogOverviewBuilding implements OnInit {
  allLocations = [] as any;
  form!: FormGroup;

  public lat = "";
  public lng = "";
  public building_name = "";
  public id = "";
  private readonly baseUrl = environment.baseUrl;

  public zoom: number = 7;
  public settings!: Settings;
  resData = [] as any;

  angForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewBuilding>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
    
    // Store the values from data
    this.building_name = this.data.event.building_name;
    this.lat = this.data.event.lat;
    this.lng = this.data.event.lng;
    this.id = this.data.event.id;

    // Set form values
    this.angForm.patchValue({
      building_name: this.building_name,
      lat: this.lat,
      lng: this.lng
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.angForm.valid) {
      // Get values from form instead of class properties
      const formValues = this.angForm.value;
      this.building_name = formValues.building_name;
      this.lat = formValues.lat;
      this.lng = formValues.lng;
      this.updateevent();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.angForm = this.fb.group({
      building_name: ["", Validators.required],
      lat: ["", Validators.required],
      lng: ["", Validators.required],
    });
  }

  updateevent() {
    if (this.building_name == "" || this.lat == "" || this.lng == "") {
      this.snackBar.open("Please fill the details", undefined, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
      return;
    }

    if (this.angForm.valid) {
      const url = `${this.baseUrl}editBuilding`;
      const data = {
        building_name: this.building_name,
        lat: this.lat,
        lng: this.lng,
        id: this.id,
      };

      this.ajaxService.post(data, url).subscribe((response: any) => {
        this.resData = response;
        
        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["blue-snackbar"],
        });

        this.dialogRef.close();
      });
    }
  }

  closeDialog(group: any) {
    this.dialogRef.close(group);
  }
}
