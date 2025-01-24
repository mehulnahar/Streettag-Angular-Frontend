import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment-mini";
import { ExcelService } from "../../excel.service";
import { PDFService } from "../../pdf.service";
import { DecimalPipe } from "@angular/common";
import { environment } from "src/environments/environment";
import { pluck } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-monitoring",
  templateUrl: "./monitoring.component.html",
  styleUrls: ["./monitoring.component.scss"],
})
export class MonitoringComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public settings: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText: string;
  public angForm: FormGroup;
  resData: any;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns: any;
  public columns;
  public dataSource: any;
  public dataSourceLocation$: Observable<any>;
  public dataSourceCircuit$:Observable<any>;
  public showTable: Boolean = false;
  public showLiabrarieColumn: Boolean = false;
  public selectedMonth: String;
  public spiner: Boolean = false;
  dataSourceMonths= [];
  constructor(
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private excelService: ExcelService,
    private pdfService: PDFService,
    private _decimalPipe: DecimalPipe
  ) {
    this.getallLocation();
    this.getMonth();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      location_id: ["", [Validators.required]],
      circuit_id: ["", [Validators.required]],
      month: ["", [Validators.required]],
    });
  }

  getallLocation() {
    const url = `${this.baseUrl}getLocations`;
    this.dataSourceLocation$ =this.ajaxService.get(url).pipe(pluck('response'))
  }

  get_location_id(res) {
    this.angForm.controls["circuit_id"].setValue("");
    this.dataSourceCircuit$ = null;
    const url = `${this.baseUrl}getCircuitByLocation`;
    var data1 = {
      location_id: res,
    };
    this.dataSourceCircuit$ = this.ajaxService.post(data1, url).pipe(pluck('response'));
  }

  getMonth() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker('./monitoring.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
         this.dataSourceMonths = data;
      };
      worker.postMessage('call');
    } else {
      let i = 0;
        do {
          this.dataSourceMonths.push({
            month_text: moment().subtract(i, "month").format("MMMM"),
            month_num: moment().subtract(i, "month").format("M"),
            year: moment().subtract(i, "month").format("YYYY"),
          });
          i++;
        } while (i < 2);
    }

  }

  onSubmit() {
    if (this.angForm.status == "VALID") {
      this.spiner = true;
      this.showTable = false;
      const dataobj = {
        location_id: this.angForm.value.location_id,
        circuit_id: this.angForm.value.circuit_id.id,
        month: this.angForm.value.month.month_num,
        year: this.angForm.value.month.year,
      };
      const url = `${this.baseUrl}getMonitoring`;
      this.ajaxService.post(dataobj, url).subscribe(
        async (data) => {
          this.selectedMonth = moment()
            .month(+this.angForm.value.month.month_num - 1)
            .format("MMMM");
          this.dataSource = await data["response"];

          //adding two column if circuit_id = 33 and 39
          this.columns = this.getColumn();
          this.displayedColumns = this.columns.map((c) => c.columnDef);
          if (
            this.angForm.value.circuit_id.id == 33 ||
            this.angForm.value.circuit_id.id == 39
          ) {
            this.columns.push(
              {
                columnDef: "libraries_books",
                header: "Number of Books taken out",
                cell: (element: any) =>
                  `${
                    this._decimalPipe.transform(element.books_taken, "1.0-2") ||
                    0
                  }`,
              },
              {
                columnDef: "libraries_points",
                header: "Number of Points awarded",
                cell: (element: any) =>
                  `${
                    this._decimalPipe.transform(
                      element.liabrary_points,
                      "1.0-2"
                    ) || 0
                  }`,
              }
            );
            this.displayedColumns = this.columns.map((c) => c.columnDef);
          }
          this.spiner = false;
          this.showTable = true;
        },
        (error) => {
          this.spiner = false;
          this.createForm();
          this.snackBar.open("Failed to load!", null, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      );
    } else {
      var errormsg = "Please pass Valid Information.";
      this.snackBar.open(errormsg, null, {
        duration: 2000,
        verticalPosition: "top",
        panelClass: "red-snackbar",
      });
    }
  }

  exportAsXLSX(): void {
    let dis = this.dataSource[0].distance
      ? this.dataSource[0].distance.toFixed(2)
      : "0";
    let reOrderObj = {
      month:
        moment()
          .month(+this.angForm.value.month.month_num - 1)
          .format("MMMM") || "N/A",
      registration: +this.dataSource[0].registration || "0",
      team: +this.dataSource[0].team || "0",
      tag_scanned: +this.dataSource[0].tag_scanned || "0",
      steps: +this.dataSource[0].steps || "0",
      score_points: +this.dataSource[0].score_points || "0",
      distance: dis,
    };

    if (
      this.angForm.value.circuit_id.id == 33 ||
      this.angForm.value.circuit_id.id == 39
    ) {
      var liabrary = {
        libraries_books: this.dataSource[0].books_taken || "0",
        libraries_points: this.dataSource[0].liabrary_points || "0",
      };
    }
    reOrderObj = { ...reOrderObj, ...liabrary };
    let year = moment().year(this.angForm.value.month.year).format("YY");
    this.excelService.exportMoinitoringAsExcel(
      reOrderObj,
      this.angForm.value.circuit_id,
      year
    );
  }

  exportAsPDF(): void {
    let dis = this.dataSource[0].distance
      ? this.dataSource[0].distance.toFixed(2)
      : 0;
    let reOrderObj = {
      month:
        moment()
          .month(+this.angForm.value.month.month_num - 1)
          .format("MMMM") || "N/A",
      registration: +this.dataSource[0].registration || 0,
      team: +this.dataSource[0].team || 0,
      tag_scanned: +this.dataSource[0].tag_scanned || 0,
      steps: +this.dataSource[0].steps || 0,
      score_points: +this.dataSource[0].score_points || 0,
      distance: +dis,
      libraries_books: +this.dataSource[0].books_taken || 0,
      libraries_points: +this.dataSource[0].liabrary_points || 0,
    };

    let year = moment().year(this.angForm.value.month.year).format("YY");
    this.pdfService.downloadPDF(
      reOrderObj,
      this.angForm.value.circuit_id,
      year
    );
  }

  getColumn() {
    return [
      {
        columnDef: "month",
        header: "Month",
        cell: (data: any) => `${this.selectedMonth}`,
      },
      {
        columnDef: "registration",
        header: "Number of new Individuals Registered",
        cell: (element: any) =>
          `${this._decimalPipe.transform(element.registration, "1.0-2") || 0}`,
      },
      {
        columnDef: "team",
        header: "Number of Teams",
        cell: (element: any) =>
          `${this._decimalPipe.transform(element.team, "1.0-2") || 0}`,
      },
      {
        columnDef: "tag_scanned",
        header: "Tag Scanned",
        cell: (element: any) =>
          `${this._decimalPipe.transform(element.tag_scanned, "1.0-2") || 0}`,
      },
      {
        columnDef: "total_steps",
        header: "Total Number of Steps",
        cell: (element: any) =>
          `${this._decimalPipe.transform(element.steps, "1.0-2") || 0}`,
      },
      {
        columnDef: "total_points",
        header: "Total Number of Points Awarded",
        cell: (element: any) =>
          `${this._decimalPipe.transform(element.score_points, "1.0-2") || 0}`,
      },
      {
        columnDef: "total_distance",
        header: "Total Miles",
        cell: (element: any) =>
          `${this._decimalPipe.transform(element.distance, "1.1-2") || 0}`,
      },
    ];
  }
}

