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
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { ExcelService } from "../../excel.service";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogModel } from "src/app/shared/confirm-dialog/confirmDialog.model";

interface PecodeData {
  id: number;
  serial_number: number;
  pecode_name: string;
  email: string;
  phone: string;
  pecode: string;
  created_at: string;
}

interface ApiResponse {
  status: string;
  data: PecodeData[];
  msg: string;
}

@Component({
  selector: "app-pecode",
  templateUrl: "./pecode.component.html",
  styleUrls: ["./pecode.component.scss"],
})
export class PecodeComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav! : any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  dataSourceTrainer: any;
  resData: any;
  form!: FormGroup;
    angForm!: FormGroup;
  data: any = [];
  trainerDATA: any;
  private readonly baseUrl = environment.baseUrl;
  public disable_btn = true;
  public displayedColumns = [
    "serial_number",
    "trainer_name",
    "pecode",
    "created_at"
  ];
  public dataSource: any;
  constructor(
    public appSettings: AppSettings,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    private router: Router,
    private excelService: ExcelService,
    private dialog: MatDialog
  ) {
    this.settings = this.appSettings.settings;
    this.getTrainers();
  }

  ngOnInit() {
    this.getPecodes();
  }

  applyFilter(filterValue: string) {
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  getPecodes() {
    const url = `${this.baseUrl}getAllpecode`;
    this.ajaxService.get(url).subscribe(
      (response: unknown) => {
        const apiResponse = response as ApiResponse;
        this.dataSource = new MatTableDataSource<PecodeData>(apiResponse.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.open("Failed to load!", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  exportAsXLSX(): void {
    this.excelService.exportPecodeAsExcel(this.resData["data"], "pecode-data");
  }

  getTrainers() {
    const url = `${this.baseUrl}getTrainers`;
    this.ajaxService.get(url).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == "true") {
          this.dataSourceTrainer = this.resData.data;
        }
      },
      (error) => {
        this.snackBar.open("Failed to load!", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  genrate_pecode() {
    this.disable_btn = true;
    const url = `${this.baseUrl}generatePecode`;
    let data = {
      tranier_name: this.trainerDATA.trainer_name,
      trainer_id: this.trainerDATA.id,
    };
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == "true") {
          this.snackBar.open(this.resData.msg, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.get_trainer_pecode(this.trainerDATA);
        }
      },
      (error) => {
        this.snackBar.open("Failed to load!", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  get_trainer_pecode(Data: { id: number }) {
    this.disable_btn = false;
    const url = `${this.baseUrl}getpecode`;
    let data = {
      trainer_id: Data.id,
    };
    this.ajaxService.post(data, url).subscribe(
      (response: unknown) => {
        const apiResponse = response as ApiResponse;
        this.resData = apiResponse;
        if (this.resData.status == "true") {
          this.dataSource = new MatTableDataSource<PecodeData>(apiResponse.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        this.snackBar.open("Failed to load!", undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    );
  }

  OpenAddBox() {
    let dialogRef = this.dialog.open(DialogBoxAddPecode, {
      data: { event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPecodes();
    });
  }

  openEditDialog(event: any) {
    let dialogRef = this.dialog.open(EditPecodePopUp, {
      data: { event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPecodes();
    });
  }

  confirmDialog(id: number): void {
    const message = `Are you sure you want to delete this pecode?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        if (![undefined, 0].includes(id)) {
          const url = `${this.baseUrl}deletePecode`;
          var data = {
            id: id,
          };
          this.ajaxService.post(data, url).subscribe((data) => {
            this.resData = data;
            let dynamicSnackColor = "blue-snackbar";
            if (this.resData.status == "false") {
              dynamicSnackColor = "red-snackbar";
            }
            this.snackBar.open(this.resData.msg, undefined, {
              duration: 3000,
              verticalPosition: "top",
              panelClass: dynamicSnackColor,
            });
            this.getPecodes();
          });
        }
      }
    });
  }
}

@Component({
  selector: "add-pecode",
  templateUrl: "./dialog-box-addPecode.html",
})
export class DialogBoxAddPecode {
  clicked = false;
  form!: FormGroup;
  name = "";
  email = "";
  phone = "";
  resData: any;
  angForm!: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxAddPecode>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      name: ["", [Validators.required]],
      phone: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ["", [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
    });
  }

  addPecode() {
    if (this.angForm.status == "VALID") {
      this.clicked = true;
      const url = `${this.baseUrl}addPecode`;
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
        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: "top",
          panelClass: dynamicSnackColor,
        });
        this.dialogRef.close();
      });
    } else {
      this.snackBar.open("Please pass Valid Information.", undefined, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }
}

@Component({
  selector: "edit-pecode",
  templateUrl: "./dialog-box-editPecode.html",
})
export class EditPecodePopUp {
  clicked = false;
  form!: FormGroup;
  resData: any;
  angForm!: FormGroup;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxAddPecode>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      id: [this.data.event.id],
      name: [this.data.event.pecode_name, [Validators.required]],
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

  UpdatePecode() {
    if (this.angForm.status == "VALID") {
      const url = `${this.baseUrl}editPecode`;
      this.ajaxService.post(this.angForm.value, url).subscribe((data) => {
        this.resData = data;
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
      this.snackBar.open("Please pass Valid Information.", undefined, {
        duration: 3000,
        verticalPosition: "top",
      });
      this.dialogRef.close();
    }
  }
}
