import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface MonitoringResponse {
  registration: number;
  team: number;
  tag_scanned: number;
  steps: number | null;
  score_points: number | null;
  distance: number | null;
}

interface ApiResponse {
  status: string;
  response: MonitoringResponse[];
}

interface OptionItem {
  id: string;
  name: string;
}

interface MonthOption {
  name: string;
  value: string;
}

interface FilterFormValue {
  location_id: string;
  circuit_id: string;
  month: string;
  year: string;
}

@Component({
  selector: 'app-monitoring-report',
  templateUrl: './monitoring-report.component.html',
  styleUrls: ['./monitoring-report.component.scss']
})
export class MonitoringReportComponent implements OnInit {
  @ViewChild('reportTable') reportTable!: ElementRef;
  @ViewChild('pdfTable') pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  filterForm: FormGroup;
  stats: any[] = [];
  dataSource: MatTableDataSource<any>;
  
  months: MonthOption[] = [
    { name: 'January', value: '1' }, 
    { name: 'February', value: '2' }
  ];

  leaderboardOptions: OptionItem[] = [
    { id: '', name: 'Select Location' },
    { id: '27', name: 'Schools Leaderboard' }
  ];

  schoolOptions: OptionItem[] = [
    { id: '', name: 'Select Circuit' },
    { id: '39', name: 'Kingstone Schools' }
  ];

  currentYear = new Date().getFullYear();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.formBuilder.group({
      location_id: ['27'],
      circuit_id: ['39'],
      month: ['2'],
      year: [this.currentYear.toString()]
    });
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.onGenerate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onGenerate() {
    const filters = this.filterForm.value as FilterFormValue;
    const url = `${environment.baseUrl}getMonitoring`;
    
    const payload = {
      location_id: filters.location_id,
      circuit_id: parseInt(filters.circuit_id),
      month: filters.month,
      year: filters.year
    };
    
    this.http.post<ApiResponse>(url, payload).subscribe(
      (response) => {
        if (response.status === 'true' && response.response) {
          const data = response.response[0];
          this.stats = [{
            month: this.months.find(m => m.value === filters.month)?.name || '',
            newIndividualsRegistered: data.registration,
            numberOfTeams: data.team,
            tagScanned: data.tag_scanned,
            totalSteps: data.steps || 0,
            totalPointsAwarded: data.score_points || 0,
            totalMiles: data.distance || 0,
          }];
          this.dataSource.data = this.stats;
        }
      },
      (error) => {
        this.snackBar.open('Error loading monitoring data', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    );
  }

  exportExcel() {
    try {
      const filters = this.filterForm.value;
      const currentDate = new Date();
      const formattedDate = `Date : ${currentDate.toLocaleDateString('en-US', { 
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })} (Monthly Report)`;
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      
      // Add title row
      const title = `Street Tag Monitoring Report (${this.schoolOptions.find(s => s.id === filters.circuit_id)?.name || 'Schools Leaderboard'})`;
      const dateRow = [formattedDate];
      
      // Prepare the data with yellow background headers
      const headers = [
        [
          { v: 'Month', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Number of new\nIndividuals\nRegistered', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Number of Teams', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Tags Scanned', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Total Number\nof Steps', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Total Number\nof Points\nAwarded', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Total Miles', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Number of\nBooks taken\nout', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } },
          { v: 'Number of\nPoints\nAwarded', t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } } }
        ]
      ];

      const data = this.stats.map(stat => [
        stat.month,
        stat.newIndividualsRegistered,
        stat.numberOfTeams,
        stat.tagScanned,
        stat.totalSteps,
        stat.totalPointsAwarded,
        stat.totalMiles,
        0, // Books taken out
        0  // Points awarded
      ]);

      // Combine all rows
      const allRows = [[title], [dateRow], [], ...headers, ...data];
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(allRows);
      
      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Month
        { wch: 20 }, // New Individuals
        { wch: 20 }, // Teams
        { wch: 15 }, // Tags
        { wch: 15 }, // Steps
        { wch: 15 }, // Points
        { wch: 15 }, // Miles
        { wch: 15 }, // Books
        { wch: 15 }  // Points Awarded
      ];
      worksheet['!cols'] = columnWidths;

      // Merge cells for title and date
      worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title row
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }  // Date row
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Monitoring Report');
      
      // Generate Excel file
      XLSX.writeFile(workbook, `monitoring_report_${this.months.find(m => m.value === filters.month)?.name}.xlsx`);
      
      this.snackBar.open('Excel file exported successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    } catch (error) {
      console.error('Export error:', error);
      this.snackBar.open('Error exporting to Excel', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  exportPdf() {
    try {
      const filters = this.filterForm.value;
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      });

      // Create PDF
      const pdf = new jsPDF('l', 'mm', 'a4');

      // Add title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const title = `Street Tag Monitoring Report (${this.schoolOptions.find(s => s.id === filters.circuit_id)?.name || 'Schools Leaderboard'})`;
      const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(title, titleX, 20);

      // Add creation date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const subtitle = `Creation Date : ${formattedDate} (Monthly Report)`;
      const subtitleWidth = pdf.getStringUnitWidth(subtitle) * pdf.getFontSize() / pdf.internal.scaleFactor;
      const subtitleX = (pageWidth - subtitleWidth) / 2;
      pdf.text(subtitle, subtitleX, 30);

      // Prepare table data
      const tableData = this.stats.map(stat => [
        stat.month,
        stat.newIndividualsRegistered,
        stat.numberOfTeams,
        stat.tagScanned,
        stat.totalSteps,
        stat.totalPointsAwarded,
        stat.totalMiles,
      ]);

      // Define table headers
      const headers = [
        ['Month', 'Number of new\nIndividuals\nRegistered', 'Number\nof\nTeams', 'Tags\nScanned', 'Total\nNumber\nof Steps', 'Total\nNumber of\nPoints Awarded', 'Total\nMiles']
      ];

      // Add table
      (pdf as any).autoTable({
        head: headers,
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 5,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [255, 255, 0],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          cellPadding: 5,
          fontSize: 10
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 25 }
        },
        didDrawCell: function(data: any) {
          if (data.section === 'head' || data.section === 'body') {
            const cell = data.cell;
            data.doc.setDrawColor(0);
            data.doc.setLineWidth(0.5);
            data.doc.rect(cell.x, cell.y, cell.width, cell.height);
          }
        }
      });

      // Save PDF
      pdf.save(`monitoring_report_${filters.month}.pdf`);
      
      this.snackBar.open('PDF file exported successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    } catch (error) {
      console.error('Export error:', error);
      this.snackBar.open('Error exporting to PDF', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }
} 