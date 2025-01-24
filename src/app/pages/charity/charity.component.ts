import { Component, OnInit, ViewChild, Inject } from "@angular/core";
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
  selector: "app-charity",
  templateUrl: "./charity.component.html",
  styleUrls: ["./charity.component.scss"],
})
export class CharityComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public form: FormGroup;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "title",
    "description",
    "match_fund",
    "charity_amount",
    "charity_image",
    "edit",
    "delete",
  ];
  public dataSource: any;
  public dataSourceLocation: any;
  public showMore = false;
  public pageNumber = 1;
  public limit = 10;
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
  }

  ngOnInit() {
    this.getChairtyList();
  }

  onPaginateChange(pagedata) {
    this.pageNumber = parseInt(pagedata.pageIndex) + 1;
    this.limit = pagedata.pageSize;
    this.getChairtyList();
  }
  getChairtyList() {
    // var url = `${this.baseUrl}getCharityList?page=${this.pageNumber}&limmit=${this.limit}`;
    var url = `${this.baseUrl}getCharityList`;
    this.ajaxService.get(url).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<Element>(data["response"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open("Session Timed Out! Please Login", null, {
            duration: 1700,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.router.navigate(["/login"]);
        } else {
          this.snackBar.open("Failed to load!", null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      }
    );
  }
  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openAddMessageDialog() {
    let dialogRef = this.dialog.open(DialogBoxAddCharity, {
      data: { event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getChairtyList();
    });
  }

  openEditDialog(event) {
    let dialogRef = this.dialog.open(EditCharityPopUp, {
      data: { event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getChairtyList();
    });
  }


  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this Charity?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
          const url = `${this.baseUrl}deleteCharity`;
          var data = {
            id: id,
          };
          this.ajaxService.post(data, url).subscribe(
            (data) => {
              this.resData = data;
              let dynamicSnackColor = "blue-snackbar";
              if (this.resData.status == "false") {
                dynamicSnackColor = "red-snackbar";
              }
              this.snackBar.open(this.resData.msg, null, {
                duration: 3000,
                verticalPosition: "top",
                panelClass: dynamicSnackColor,
              });
              this.getChairtyList();
            },
            (error) => {
              if (error.status === 403) {
                this.snackBar.open("Session Timed Out! Please Login", null, {
                  duration: 1700,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                });
                this.router.navigate(["/login"]);
              } else {
                this.snackBar.open("Failed to load!", null, {
                  duration: 3000,
                  verticalPosition: "top",
                  panelClass: ["red-snackbar"],
                });
              }
            }
          );
        
      }
    });
  }
}

@Component({
  selector: "add-Charity",
  templateUrl: "./charity-add.html",
})
export class DialogBoxAddCharity {
  clicked = false;
  form: FormGroup;
  title = "";
  description = "";
  imageSrc: any;
  resData: any;
  angForm: FormGroup;
  Fund: string = "0";
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxAddCharity>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      requiredfile: ["", [Validators.required]],
    });
  }

  addCharityData() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}addCharity`;
      var data = {
        title: this.angForm.value.title,
        description: this.angForm.value.description,
        charity_image: this.imageSrc,
        fund: this.Fund,
      };
      this.ajaxService.post(data, url).subscribe(
        (data) => {
          this.resData = data;
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
        },
        (error) => {
          if (error.status === 403) {
            this.snackBar.open("Session Timed Out! Please Login", null, {
              duration: 1700,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
            this.router.navigate(["/login"]);
          } else {
            this.snackBar.open("Failed to load!", null, {
              duration: 2000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          }
        }
      );
    } else {
      var errormsg = "Please pass Valid Information.";
      if (["", undefined, null].includes(this.angForm.value.requiredfile)) {
        errormsg = "Please pass image.";
      }
      this.snackBar.open(errormsg, null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
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
  }
}



@Component({
  selector: "edit-trainer",
  templateUrl: "./dialog-box-editCharity.html",
})
export class EditCharityPopUp {
  clicked: Boolean = false;
  form: FormGroup;
  resData: any;
  angForm: FormGroup;
  imageSrc: any;
  charity_image: string;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<EditCharityPopUp>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  public Fund = String(this.data.event.fund);
  createForm() {
    this.charity_image = this.data.event.charity_image;
    this.angForm = this.fb.group({
      id: [this.data.event.id],
      title: [this.data.event.title, [Validators.required]],
      description: [this.data.event.charity_data, [Validators.required]],
      requiredfile: [this.data.event.charity_image, [Validators.required]],
    });
  }

  editCharityData() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      let data = {
        title: this.angForm.value.title,
        description: this.angForm.value.description,
        charity_image: this.imageSrc,
        fund: this.Fund,
        id: this.angForm.value.id,
      };
      const url = `${this.baseUrl}editCharity`;
      this.ajaxService.post(data, url).subscribe(
        (data) => {
          this.resData = data;
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
        },
        (error) => {
          if (error.status === 403) {
            this.snackBar.open("Session Timed Out! Please Login", null, {
              duration: 1700,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
            this.router.navigate(["/login"]);
          } else {
            this.snackBar.open("Failed to load!", null, {
              duration: 2000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          }
        }
      );
    } else {
      this.snackBar.open("Please pass Valid Information.", null, {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
      this.dialogRef.close();
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
  }
}
