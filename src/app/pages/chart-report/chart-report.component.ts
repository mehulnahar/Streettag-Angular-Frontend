import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { Router } from "@angular/router";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment-mini";
import html2canvas from "html2canvas/dist/html2canvas.min";
import * as FileSaver from "file-saver";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../chart-report/format-datepicker";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs/internal/Observable";
import { pluck } from "rxjs/internal/operators/pluck";

@Component({
  selector: "app-chart-report",
  templateUrl: "./chart-report.component.html",
  styleUrls: ["./chart-report.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ChartReportComponent implements OnInit {
  @ViewChild("download", { static: true }) download: ElementRef;
  public showLegend = true;
  public gradient = true;
  public colorScheme = {
    domain: ["#2F3E9E", "#D22E2E", "#378D3B", "#0096A6", "#F47B00", "#606060"],
  };
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false;
  public settings: Settings;
  public dataSource: any;
  public LineBarData: any;
  public BarData: any;
  public angForm: any;
  public dataSourceLocation$:Observable<any>;
  public dataSourceCircuit$:Observable<any>;
  dataSourceMonths: Array<any> = [];
  public showgraph;
  public spinner: Boolean = false;
  public showDurationOption: Boolean = true;
  public showDatePicker: Boolean = false;
  minDate: Date;
  maxDate: Date;
  xAxisLabel: String = "Date";
  yAxisLabel: String = "Data";
  LineBarLabel: String;
  legend: Boolean = false;
  legendTitle: String = "Legend";
  public disableDownloadButton: Boolean = true;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public appSettings: AppSettings,
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.settings = this.appSettings.settings;
    this.createForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date(currentYear, currentMonth - 1, 1);
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.getMonth();
    this.getallLocation();
  }

  createForm() {
    this.angForm = this.fb.group({
      location_id: ["", [Validators.required]],
      circuit_id: ["", [Validators.required]],
      duration: ["", [Validators.required]],
      start_date: [""],
      end_date: [""],
      report_type: ["", [Validators.required]],
    });
  }

  getallLocation() {
    const url = `${this.baseUrl}getLocations`;
    this.dataSourceLocation$ = this.ajaxService.get(url).pipe(pluck('response'))
  }

  get_location_id(res) {
    this.disableDownloadButton = true;
    this.angForm.controls["circuit_id"].setValue("");
    this.dataSourceCircuit$ = null;
    const url = `${this.baseUrl}getCircuitByLocation`;
    var data1 = {
      location_id: res,
    };
    this.dataSourceCircuit$ = this.ajaxService.post(data1, url).pipe(pluck('response'))
  }

  getDatePicker(event) {
    this.disableDownloadButton = true;
    if (event == 1) {
      this.showDurationOption = false;
      this.showDatePicker = true;
    }
  }

  CloseStartEndDate() {
    this.disableDownloadButton = true;
    this.showDatePicker = false;
    this.showDurationOption = true;
    this.angForm.get("duration").setValue("");
  }

  DisableDownloadButton() {
    this.disableDownloadButton = true;
  }

  getMonth() {
    //Do not change the text value
   //Calling getMonth Web Worker
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./get-month.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.dataSourceMonths = data;
      };
      worker.postMessage('call');
    } else {
    let i = 0;
    this.dataSourceMonths.push(
      {
        text: "Today",
        start_date: moment().format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
      },
      {
        text: "Current Week",
        start_date: moment().startOf("week").format("YYYY-MM-DD"),
        end_date: moment().endOf("week").format("YYYY-MM-DD"),
      }
    );
    //Adding pervious and current month.
    do {
      this.dataSourceMonths.push({
        text: moment().subtract(i, "month").format("MMMM"),
        start_date: moment()
          .subtract(i, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
        end_date: moment()
          .subtract(i, "month")
          .endOf("month")
          .format("YYYY-MM-DD"),
      });
      i++;
    } while (i < 2);
  }
  }

  onSubmit(params: any) {
    this.spinner = true;
    this.showgraph = null;
    let requestObj;
    if (this.showDurationOption == false) {
      requestObj = {
        circuit_id: params.circuit_id,
        location_id: params.location_id,
        start_date: moment(this.angForm.value.start_date).format("YYYY-MM-DD"),
        end_date: moment(this.angForm.value.end_date).format("YYYY-MM-DD"),
        report_type: params.report_type,
      };
    } else {
      requestObj = {
        circuit_id: params.circuit_id,
        location_id: params.location_id,
        start_date: params.duration.start_date,
        end_date: params.duration.end_date,
        report_type: params.report_type,
      };
    }
    let SelectedValue = this.angForm.value.report_type;
    if (SelectedValue == 1) {
      this.getChartData(requestObj);
      return;
    } else if (SelectedValue == 2) {
      this.getStepsLineData(requestObj);
      return;
    } else if (SelectedValue == 3) {
      if (params.duration.text == "Current Week") {
        requestObj.week = true;
      } else {
        requestObj.week = false;
      }
      this.getStepsBarData(requestObj);
      return;
    } else if (SelectedValue == 4) {
      this.getParticipants(requestObj);
      return;
    }
  }

  getChartData(requestObj: any) {
    const url = `${this.baseUrl}getStepsChartData`;
    this.ajaxService.post(requestObj, url).subscribe(async (data) => {
      let dataSource = await data["response"];
      if (dataSource.length > 0) {
        Object.assign(this, { dataSource });
        this.spinner = false;
        this.showgraph = this.angForm.value.report_type;
        this.disableDownloadButton = false;
      } else {
        this.snackBar.open("No data found", null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        this.spinner = false;
        this.disableDownloadButton = true;
      }
    });
  }

  getStepsLineData(requestObj: any) {
    this.yAxisLabel = "No. of Tags Scanned ";
    this.LineBarLabel = "Activities by Category";
    this.legend = true;
    this.legendTitle = "Scan Mode";
    const url = `${this.baseUrl}getStepsLineData`;
    this.ajaxService.post(requestObj, url).subscribe(async (data) => {
      let LineBarData = await data["response"];
      if (LineBarData[0].series.length > 0) {
        Object.assign(this, { LineBarData });
        this.spinner = false;
        this.showgraph = 2;
        this.disableDownloadButton = false;
      } else {
        this.snackBar.open("No data found", null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        this.spinner = false;
        this.disableDownloadButton = true;
      }
    });
  }

  getStepsBarData(requestObj: any) {
    this.yAxisLabel = "No. of Scanned Tags";
    this.LineBarLabel = "Scanned Tags";
    if (requestObj.week == true) {
      this.yAxisLabel = "No. of Scanned Tags";
      this.xAxisLabel = "Days";
    }
    const url = `${this.baseUrl}getStepsBarData`;
    this.ajaxService.post(requestObj, url).subscribe(async (data) => {
      let BarData = await data["response"];
      if (BarData.length > 0) {
        Object.assign(this, { BarData });
        this.spinner = false;
        this.showgraph = 3;
        this.disableDownloadButton = false;
      } else {
        this.snackBar.open("Data not found", null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        this.spinner = false;
        this.disableDownloadButton = true;
      }
    });
  }

  getParticipants(params: any) {
    this.yAxisLabel = "No. of Players";
    this.LineBarLabel = "New Registered Players";
    this.legend = false;
    const url = `${this.baseUrl}getParticipants`;
    this.ajaxService.post(params, url).subscribe(async (data) => {
      let LineBarData = await data["response"];
      if (LineBarData[0].series.length > 0) {
        Object.assign(this, { LineBarData });
        this.spinner = false;
        this.showgraph = 2;
        this.disableDownloadButton = false;
      } else {
        this.snackBar.open("Not Registered new player yet.", null, {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        this.spinner = false;
        this.disableDownloadButton = true;
      }
    });
  }

  Download() {
    html2canvas(this.download.nativeElement, {
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      canvas.toBlob(function (blob) {
        // To save manually somewhere in file explorer
        FileSaver.saveAs(blob, `Graphical-report.png`);
      }, "image/png");
    });
  }
}
