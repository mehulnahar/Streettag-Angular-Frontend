import { Component, OnInit, ViewChild, Inject, Input } from "@angular/core";
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
  selector: "app-trainer",
  templateUrl: "./trainer.component.html",
  styleUrls: ["./trainer.component.scss"],
})
export class TrainerComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private readonly baseUrl = environment.baseUrl;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public showSearch: boolean = false;
  public searchText: string;
  public type: string = "all";
  public dataSource: any;
  resData: any;
  public displayedColumns = [
    "serial_number",
    "trainer_name",
    "email",
    "phone",
    "edit",
    "delete",
  ];
  constructor(
    private snackBar: MatSnackBar,
    private ajaxService: AjaxService,
    private router: Router,
    private appSettings: AppSettings,
    private dialog: MatDialog
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getTrainers();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTrainers() {
    const url = `${this.baseUrl}getTrainers`;
    this.ajaxService.get(url).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<Element>(data["data"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.open("Failed to load!", null, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  OpenAddBox() {
    let dialogRef = this.dialog.open(DialogBoxAddTrainer, {
      data: { event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getTrainers();
    });
  }

  openEditDialog(event) {
    let dialogRef = this.dialog.open(EditTrainersPopUp, {
      data: { event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getTrainers();
    });
  }


  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this trainer?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        if (![undefined, 0].includes(id)) {
          const url = `${this.baseUrl}deleteTrainer`;
          var data = {
            id: id,
          };
          this.ajaxService.post(data, url).subscribe((data) => {
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
            this.getTrainers();
          });
        }
        }
      });
      }
    
}

@Component({
  selector: "add-trainer",
  templateUrl: "./dialog-box-addTrainer.html",
})
export class DialogBoxAddTrainer {
  clicked = false;
  form: FormGroup;
  name = "";
  email = "";
  phone = "";
  resData: any;
  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<DialogBoxAddTrainer>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      name: ["", [Validators.required]],
      phone: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
    });
  }

  addTrainer() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}addTrainer`;
      var data = {
        name: this.name,
        phone: this.phone,
        email: this.email,
      };
      this.ajaxService.post(data, url).subscribe((data) => {
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
      });
    } else {
      this.snackBar.open("Please pass Valid Information.", null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }
}

@Component({
  selector: "edit-trainer",
  templateUrl: "./dialog-box-editTrainer.html",
})
@Input()
export class EditTrainersPopUp {
  clicked = false;
  form: FormGroup;
  resData: any;
  angForm: FormGroup;
  private readonly baseUrl = environment.baseUrl;
  constructor(
    public dialogRef: MatDialogRef<DialogBoxAddTrainer>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    public formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      id: [this.data.event.id],
      name: [this.data.event.trainer_name, [Validators.required]],
      phone: [
        this.data.event.phone,
        [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
      ],
      email: [
        this.data.event.email,
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
    });
  }

  UpdateTrainer() {
    if (this.angForm.status == "VALID") {
      const url = `${this.baseUrl}editTrainer`;
      this.ajaxService.post(this.angForm.value, url).subscribe((data) => {
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
      });
    } else {
      this.snackBar.open("Please pass Valid Information.", null, {
        duration: 3000,
        verticalPosition: "top",
      });
      this.dialogRef.close();
    }
  }
}
