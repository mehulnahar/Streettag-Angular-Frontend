import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import { Workbook, Cell } from "exceljs";
import { format } from 'date-fns';

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable()
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add headers
    const headerRow = worksheet.addRow(['Month', 'Number of new Individuals Registered', 'Number of Teams', 'Tags Scanned', 'Total Number of Steps', 'Total Number of Points Awarded', 'Total Miles']);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' } // Yellow background
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
    });

    // Add data
    json.forEach(item => {
      const row = worksheet.addRow(Object.values(item));
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      });
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    });
  }

  public exportPecodeAsExcel(json: any[], excelFileName: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers
    const headers = ["Serial Number", "Trainer Name", "Pecode", "Created At"];
    const headerRow = worksheet.addRow(headers);

    // Style headers
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    // Add data
    json.forEach(item => {
      worksheet.addRow([
        item.serial_number,
        item.trainer_name,
        item.pecode,
        item.created_at
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  public exportMoinitoringAsExcel(data: any, circuitName: string, month: string, year: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Title and Date
    const titleRow = worksheet.addRow(['', 'Street Tag Monitoring Report (Mindcrew Workforce)']);
    titleRow.getCell(2).font = { bold: true, size: 14 };
    
    const dateRow = worksheet.addRow(['', `Date : ${month} ${year} (Monthly Report)`]);
    dateRow.getCell(2).font = { size: 12 };
    
    worksheet.addRow([]);

    worksheet.columns = [
      { width: 15 },
      { width: 30 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
    ];

    const headers = [
      'Month',
      'Number of new\nIndividuals Registered',
      'Number of Teams',
      'Tags Scanned',
      'Total Number of\nSteps',
      'Total Number of\nPoints Awarded',
      'Total Miles'
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.height = 40;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }
      };
      cell.font = { 
        bold: true,
        size: 11
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    const dataRow = worksheet.addRow([
      month,
      data.registration,
      data.team,
      data.tag_scanned,
      data.steps,
      data.score_points,
      data.distance
    ]);

    dataRow.height = 25;
    dataRow.eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (Number(cell.col) > 1) {
        cell.numFmt = '0';
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, `monitoring_report_${month}_${year}.xlsx`);
    });
  }

  public async exportquesExcel(json: any[], objData: { circuit_id: string; startDate: string; endDate: string }): Promise<void> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers based on the first object's keys
    if (json.length > 0) {
      const headers = Object.keys(json[0]);
      worksheet.addRow(headers);
    }

    // Add data
    json.forEach(item => {
      worksheet.addRow(Object.values(item));
    });

    // Style the worksheet
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      });
      
      if (rowNumber === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }
          };
          cell.font = { bold: true };
        });
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `${objData.circuit_id} (${objData.startDate} To ${objData.endDate})`;
    const blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(blob, filename + EXCEL_EXTENSION);
  }

  public exportAsExcelFileN(json: any[], excelFileName: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers based on the first object's keys
    if (json.length > 0) {
      const headers = Object.keys(json[0]);
      worksheet.addRow(headers);
    }

    // Add data
    json.forEach(item => {
      worksheet.addRow(Object.values(item));
    });

    // Style the worksheet
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      });
      
      if (rowNumber === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }
          };
          cell.font = { bold: true };
        });
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  public exportConsentData(json: any[], excelFileName: string): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Consent Data');

    // Define headers exactly as shown in the image
    const headers = [
        'serial_number',
        'fullname',
        'email',
        'phone_number',
        'created_at',
        'share_info'
    ];

    // Add headers
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }
        };
        cell.font = {
            bold: true,
            size: 11
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
    });

    // Add data rows
    json.forEach((item) => {
        const row = worksheet.addRow([
            item.serial_number,
            item.fullname,
            item.email,
            item.phone_number,
            item.created_at,
            item.share_info
        ]);

        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'left'
            };
        });
    });

    // Auto-fit columns with type-safe column numbers
    worksheet.columns.forEach((column, index) => {
        if (column && typeof index === 'number') {
            const values = worksheet.getColumn(index + 1).values;
            const maxLength = values
                .filter((v): v is string | number => v !== null && v !== undefined)
                .map(v => v.toString().length)
                .reduce((max, curr) => Math.max(max, curr), 0);
            
            column.width = Math.max(maxLength, headers[index]?.length || 0) + 2;
        }
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, excelFileName + '.xlsx');
    });
  }
}
