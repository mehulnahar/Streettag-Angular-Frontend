import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AjaxService } from "src/app/ajax.service";
import { format, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Observable, of } from "rxjs";
import { Settings } from "../../app.settings.model";
import { AppSettings } from "../../app.settings";
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { map, catchError, finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-chart-report",
  templateUrl: "./chart-report.component.html",
  styleUrls: ["./chart-report.component.scss"]
})
export class ChartReportComponent implements OnInit {
  public settings: Settings;
  public angForm: FormGroup;
  public isLoading = false;
  public showgraph = false;
  public dataSourceLocation$ = new Observable<any>();
  public dataSourceCircuit$ = new Observable<any>();
  public dataSourceMonths: any[] = [];
  
  // Chart data
  public pieChartData: any[] = [];
  public lineChartData: any[] = [];
  public barChartData: any[] = [];
  public chartTitle = '';

  // Chart options
  public showLegend = true;
  public showLabels = true;
  public animations = true;
  public xAxis = true;
  public yAxis = true;
  public showYAxisLabel = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Date';
  public yAxisLabel = 'Value';
  public timeline = true;
  public autoScale = true;
  public roundDomains = true;

  // Color scheme
  public colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2196F3']  // Single color for bar chart
  };

  // Y-axis tick formatting
  yAxisTickFormatting = (value: number) => {
    return Math.floor(value).toString(); // Return whole numbers only
  };

  public durations = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'Current Week' },
    { id: 'february', name: 'February' },
    { id: 'january', name: 'January' },
    { id: 'custom', name: 'Choose Start/End Date' }
  ];

  constructor(
    public appSettings: AppSettings,
    public ajax: AjaxService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.settings = this.appSettings.settings;
    this.angForm = this.fb.group({
      location_id: ['', Validators.required],
      circuit_id: ['', Validators.required],
      report_type: ['', Validators.required],
      duration: ['', Validators.required],
      start_date: [''],
      end_date: ['']
    });
    this.loadLocations();
    this.setupMonths();

    // Subscribe to duration changes
    this.angForm.get('duration')?.valueChanges.subscribe(value => {
      this.handleDurationChange(value);
    });
  }

  ngOnInit() {}

  loadLocations() {
    this.isLoading = true;
    this.dataSourceLocation$ = this.ajax.getLocations().pipe(
      map((response: any) => {
        if (response && response.status === "true" && Array.isArray(response.response)) {
          return response.response.sort((a: { serial_number: number }, b: { serial_number: number }) => 
            a.serial_number - b.serial_number
          );
        }
        return [];
      }),
      catchError(error => {
        console.error('Error loading locations:', error);
        this.snackBar.open('Error loading locations', '', { duration: 2000 });
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  get_location_id(locationId: string) {
    if (locationId) {
      this.dataSourceCircuit$ = this.ajax.getCircuits(locationId).pipe(
        map((response: any) => {
          if (response && response.status === "true" && Array.isArray(response.response)) {
            return response.response;
          }
          return [];
        }),
        catchError(error => {
          console.error('Error loading circuits:', error);
          this.snackBar.open('Error loading circuits', '', { duration: 2000 });
          return of([]);
        })
      );
    } else {
      this.dataSourceCircuit$ = new Observable();
    }
  }

  setupMonths() {
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = subMonths(today, i);
      this.dataSourceMonths.push({
        month_text: format(date, 'MMMM'),
        month_num: format(date, 'M'),
        year: format(date, 'yyyy')
      });
    }
  }

  handleDurationChange(duration: string) {
    const today = new Date();
    
    switch (duration) {
      case 'today':
        this.angForm.patchValue({
          start_date: today,
          end_date: today
        });
        this.showgraph = true;
        break;
      
      case 'week':
        this.angForm.patchValue({
          start_date: startOfWeek(today),
          end_date: endOfWeek(today)
        });
        this.showgraph = true;
        break;
      
      case 'february':
        this.angForm.patchValue({
          start_date: startOfMonth(new Date(today.getFullYear(), 1, 1)),
          end_date: endOfMonth(new Date(today.getFullYear(), 1, 1))
        });
        this.showgraph = true;
        break;
      
      case 'january':
        this.angForm.patchValue({
          start_date: startOfMonth(new Date(today.getFullYear(), 0, 1)),
          end_date: endOfMonth(new Date(today.getFullYear(), 0, 1))
        });
        this.showgraph = true;
        break;
      
      case 'custom':
        this.angForm.patchValue({
          start_date: null,
          end_date: null
        });
        this.showgraph = true;
        break;
      
      default:
        this.showgraph = false;
        break;
    }
  }

  downloadChart(): void {
    if (!this.angForm.valid) {
      this.snackBar.open('Please fill all required fields', '', { duration: 2000 });
      return;
    }

    const formValue = this.angForm.value;
    const requestObj = {
      circuit_id: formValue.circuit_id,
      location_id: formValue.location_id,
      start_date: format(new Date(formValue.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(formValue.end_date), 'yyyy-MM-dd'),
      report_type: formValue.report_type
    };

    this.isLoading = true;
    this.ajax.downloadChartData(requestObj).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chart_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error downloading chart:', error);
        this.snackBar.open('Error downloading chart data', '', { duration: 2000 });
      }
    });
  }

  async getReport(): Promise<void> {
    if (!this.angForm.valid) {
      this.snackBar.open('Please fill all required fields', '', { duration: 2000 });
      return;
    }

    const formValue = this.angForm.value;
    const requestObj = {
      circuit_id: formValue.circuit_id,
      location_id: formValue.location_id,
      start_date: format(new Date(formValue.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(formValue.end_date), 'yyyy-MM-dd'),
      report_type: formValue.report_type
    };

    try {
      this.isLoading = true;
      let data;

      // Reset all chart data
      this.pieChartData = [];
      this.lineChartData = [];
      this.barChartData = [];

      switch (formValue.report_type) {
        case '1': // Pie Chart
          data = await this.ajax.getStepsChartData(requestObj).toPromise();
          if (data?.response) {
            this.pieChartData = this.transformPieChartData(data.response);
            this.chartTitle = 'Activity Distribution';
          }
          break;

        case '2': // Line Chart - Steps
          data = await this.ajax.getStepsLineData(requestObj).toPromise();
          if (data?.response) {
            // Check if any series has data
            const hasData = data.response.some((item: any) => item.series && item.series.length > 0);
            if (hasData) {
              this.lineChartData = data.response;
              this.chartTitle = 'Steps Count Over Time';
              this.yAxisLabel = 'Steps';
            } else {
              this.snackBar.open('No data available for the selected period', '', { duration: 2000 });
            }
          }
          break;

        case '3': // Bar Chart - Tags
          data = await this.ajax.getStepsBarData(requestObj).toPromise();
          if (data?.response) {
            this.barChartData = this.transformBarChartData(data.response);
            this.chartTitle = 'Tags Scanned by Date';
            this.yAxisLabel = 'No. of Scanned Tags';
          }
          break;

        case '4': // Line Chart - Players
          data = await this.ajax.getParticipants(requestObj).toPromise();
          if (data?.response) {
            // Check if any series has data
            const hasData = data.response.some((item: any) => item.series && item.series.length > 0);
            if (hasData) {
              this.lineChartData = data.response;
              this.chartTitle = 'New Players Registration';
              this.yAxisLabel = 'Players';
            } else {
              this.snackBar.open('No data available for the selected period', '', { duration: 2000 });
            }
          }
          break;
      }

      // Check if we have any data to display
      if (!data?.response || 
          (Array.isArray(data.response) && !data.response.length) ||
          (formValue.report_type === '2' && !this.lineChartData.length) ||
          (formValue.report_type === '4' && !this.lineChartData.length)) {
        this.snackBar.open('No data available for the selected period', '', { duration: 2000 });
      }

    } catch (error) {
      console.error('Error fetching chart data:', error);
      this.snackBar.open('Error loading chart data', '', { duration: 2000 });
    } finally {
      this.isLoading = false;
    }
  }

  private transformPieChartData(data: any[]): any[] {
    return data.map(item => ({
      name: item.name,
      value: item.value
    }));
  }

  private transformBarChartData(data: any[]): any[] {
    // Ensure data is sorted by date
    const sortedData = [...data].sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    
    return sortedData.map(item => ({
      name: format(new Date(item.name), 'MMM dd'), // Format date to be more readable
      value: Number(item.value) // Ensure value is a number
    }));
  }
}
