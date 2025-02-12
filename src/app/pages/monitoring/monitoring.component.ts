import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Settings } from '../../app.settings.model';
import { AjaxService } from 'src/app/ajax.service';
import { format, subMonths } from 'date-fns';
import { ExcelService } from '../../excel.service';
import { PDFService } from '../../pdf.service';
import { DecimalPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MonthData {
  month_text: string;
  month_num: string;
  year: string;
}

interface CircuitData {
  id: number;
  circuit_name: string;
}

interface Location {
  id: number;
  location_name: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  serial_number: number;
}

interface MonitoringData {
  registration?: number;
  team?: number;
  tag_scanned?: number;
  steps?: number;
  score_points?: number;
  distance?: number;
  books_taken?: number;
  liabrary_points?: number;
}

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  @ViewChild("sidenav", { static: false }) sidenav: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public settings!: Settings;
  public sidenavOpen: boolean = true;
  public type: string = "all";
  public showSearch: boolean = false;
  public searchText = '';
  public angForm!: FormGroup;
  public resData: any;
  private readonly baseUrl = environment.baseUrl;
  public displayedColumns: string[] = [];
  public columns: any[] = [];
  public dataSource = new MatTableDataSource<any>([]);
  public dataSourceLocation$ = new Observable<Location[]>();
  public dataSourceCircuit$ = new Observable<CircuitData[]>();
  public showTable: Boolean = false;
  public showLiabrarieColumn: Boolean = false;
  public selectedMonth = '';
  public spiner: Boolean = false;
  public dataSourceMonths: MonthData[] = [];
  public isLoading = false;

  constructor(
    private ajax: AjaxService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private excelService: ExcelService,
    private pdfService: PDFService,
    private _decimalPipe: DecimalPipe
  ) {
    this.createForm();
    this.loadLocations();
    this.setupMonths();
  }

  ngOnInit() {
    this.setupColumns();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm() {
    this.angForm = this.fb.group({
      location_id: ['', Validators.required],
      circuit_id: ['', Validators.required],
      month: ['', Validators.required]
    });
  }

  loadLocations() {
    this.dataSourceLocation$ = this.ajax.getLocations().pipe(
      map((response: any) => {
        if (response && response.status === "true" && Array.isArray(response.response)) {
          return response.response;
        }
        return [];
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
        })
      );
    } else {
      this.dataSourceCircuit$ = new Observable();
    }
  }

  setupMonths() {
    this.dataSourceMonths = [
      {
        month_text: 'January',
        month_num: '1',
        year: new Date().getFullYear().toString()
      },
      {
        month_text: 'February',
        month_num: '2',
        year: new Date().getFullYear().toString()
      }
    ];
  }

  setupColumns() {
    this.columns = [
      { columnDef: 'registration', header: 'Number of new Individuals Registered' },
      { columnDef: 'team', header: 'Number of Teams' },
      { columnDef: 'tag_scanned', header: 'Tag Scanned' },
      { columnDef: 'steps', header: 'Total Number of Steps' },
      { columnDef: 'score_points', header: 'Total Number of Points Awarded' },
      { columnDef: 'distance', header: 'Total Miles' }
    ];
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  async getReport() {
    if (!this.angForm.valid) return;

    try {
      this.isLoading = true;
      const formValue = this.angForm.value;
      
      const data = await this.ajax.getMonitoringReport({
        location_id: formValue.location_id,
        circuit_id: formValue.circuit_id,
        month: formValue.month.month_num,
        year: formValue.month.year
      }).toPromise();

      if (data?.response) {
        this.dataSource = new MatTableDataSource(data.response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.snackBar.open('No data found', undefined, {
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error fetching monitoring report:', error);
      this.snackBar.open('Error fetching data', undefined, {
        duration: 2000
      });
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter(filterValue: string) {
    if (this.dataSource) {
      filterValue = filterValue.trim().toLowerCase();
      this.dataSource.filter = filterValue;
      
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  exportToExcel() {
    if (!this.dataSource?.data?.length) return;

    const exportData = this.dataSource.data.map(item => {
      const row: any = {};
      this.columns.forEach(col => {
        row[col.header] = item[col.columnDef];
      });
      return row;
    });

    this.excelService.exportAsExcelFile(exportData, 'monitoring-report');
  }

  exportAsXLSX(): void {
    if (!this.dataSource?.data?.[0]) return;

    const data = this.dataSource.data[0];
    const formValue = this.angForm.value;
    const monthData = formValue.month as MonthData;
    
    const distance = data.distance ? Number(data.distance).toFixed(2) : '0';
    
    const reOrderObj = {
      Month: monthData.month_text,
      registration: data.registration || 0,
      team: data.team || 0,
      tag_scanned: data.tag_scanned || 0,
      steps: data.steps || 0,
      score_points: data.score_points || 0,
      distance: Number(distance)
    };

    this.excelService.exportMoinitoringAsExcel(
      reOrderObj,
      'Mindcrew Workforce',
      monthData.month_text,
      monthData.year
    );
  }

  exportAsPDF(): void {
    if (!this.dataSource?.data?.[0]) return;

    const data = this.dataSource.data[0];
    const formValue = this.angForm.value;
    const monthData = formValue.month as MonthData;
    const selectedCircuit = this.dataSourceCircuit$.pipe(
      map(circuits => circuits.find(c => c.id === formValue.circuit_id))
    );

    selectedCircuit.subscribe(circuit => {
      const reportData = {
        month: monthData.month_text,
        year: monthData.year,
        circuitName: circuit?.circuit_name || '',
        data: [
          { value: data.registration || 0 },
          { value: data.team || 0 },
          { value: data.tag_scanned || 0 },
          { value: data.steps || 0 },
          { value: data.score_points || 0 },
          { value: data.distance ? Number(data.distance).toFixed(2) : '0' }
        ]
      };

      if (formValue.circuit_id === 33 || formValue.circuit_id === 39) {
        reportData.data.push(
          { value: data.books_taken || 0 },
          { value: data.liabrary_points || 0 }
        );
      }

      this.pdfService.downloadPDF(reportData);
    });
  }
}

