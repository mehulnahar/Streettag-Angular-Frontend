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

@Component({
  selector: "app-pecode",
  templateUrl: "./pecode.component.html",
  styleUrls: ["./pecode.component.scss"],
})
export class PecodeComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  dataSourceTrainer: any;
  resData: any;
  form: FormGroup;
  angForm: FormGroup;
  data: any = [];
  trainerDATA;
  private readonly baseUrl = environment.baseUrl;
  public disable_btn = true;
  public displayedColumns = ["serial_number", "trainer_name", "pecode", "date"];
  public dataSource: any;
  constructor(
    public appSettings: AppSettings,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    private router: Router,
    private excelService: ExcelService
  ) {
    this.settings = this.appSettings.settings;
    this.getTrainers();
  }

  ngOnInit() {
    this.getAllPecode();
  }

  getAllPecode() {
    this.disable_btn = true;
    const url = `${this.baseUrl}getAllpecode`;
    this.ajaxService.get(url).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == "true") {
          this.dataSource = new MatTableDataSource<Element>(data["data"]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
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
        this.snackBar.open("Failed to load!", null, {
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
          this.snackBar.open(this.resData.msg, null, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.get_trainer_pecode(this.trainerDATA);
        }
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

  get_trainer_pecode(Data) {
    this.disable_btn = false;
    const url = `${this.baseUrl}getpecode`;
    let data = {
      trainer_id: Data.id,
    };
    this.ajaxService.post(data, url).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == "true") {
          this.dataSource = new MatTableDataSource<Element>(data["data"]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
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
}
