import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { WorkSheet, WorkBook, JSON2SheetOpts } from "xlsx";
import { Workbook as ExcelWorkbook, Cell } from "exceljs";
import moment from "moment";
import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns';


const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable()
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const workbook = new ExcelJS.Workbook();
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
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, excelFileName + '.xlsx');
    });
  }

  public exportPecodeAsExcel(json: any[], excelFileName: string): void {
    let options: JSON2SheetOpts = {
      header: ["serial_number", "trainer_name", "pecode", "created_at"],
    };
    const worksheet: WorkSheet = XLSX.utils.json_to_sheet(json, options);
    const workbook: WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportMoinitoringAsExcel(data: any, circuitName: string, month: string, year: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Monitoring Report');

    // Set column widths
    worksheet.columns = [
      { width: 12 }, // A - Month
      { width: 25 }, // B - Number of new Individuals
      { width: 18 }, // C - Number of Teams
      { width: 15 }, // D - Tags Scanned
      { width: 18 }, // E - Total Steps
      { width: 20 }, // F - Total Points
      { width: 12 }, // G - Total Miles
    ];

    // Headers
    const headers = [
      'Month',
      'Number of new\nIndividuals\nRegistered',
      'Number of Teams',
      'Tags Scanned',
      'Total Number of\nSteps',
      'Total Number of\nPoints Awarded',
      'Total Miles'
    ];

    // Add header row
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 45;

    // Style header row
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

    // Add data row with numeric values
    const dataRow = worksheet.addRow([
      1,
      1,
      0,
      0,
      0,
      0,
      0
    ]);

    // Style data row
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
      // Set numeric format
      cell.numFmt = '0';
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `monitoring_report_${month}_${year}.xlsx`);
    });
  }

  private async saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
  await FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  public async exportquesExcel(json: any[], objData: { circuit_id: string; startDate: string; endDate: string }): Promise<void> {
    let options: JSON2SheetOpts = {
      // header: ["serial_number", "trainer_name", "pecode", "created_at"],
    };
    const worksheet: WorkSheet = XLSX.utils.json_to_sheet(json, options);
    const workbook: WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = await XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const filename = `${objData.circuit_id} (${objData.startDate} To ${objData.endDate})`;
   await this.saveAsExcelFile(excelBuffer, filename);
}




public exportAsExcelFileN(json: any[], excelFileName: string): void {
  const worksheet: WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: WorkBook = {
    Sheets: { data: worksheet },
    SheetNames: ["data"],
  };
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  this.saveAsExcelFileN(excelBuffer, excelFileName);
}


private async saveAsExcelFileN(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], {
    type: EXCEL_TYPE,
  });
await FileSaver.saveAs(
    data,
    fileName + new Date().getTime() + EXCEL_EXTENSION
  );
}

public exportConsentData(json: any[], excelFileName: string): void {
    const workbook = new ExcelJS.Workbook();
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
