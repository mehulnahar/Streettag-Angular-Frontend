import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver/dist/FileSaver.min";
import * as XLSX from "xlsx/dist/xlsx.full.min";
import { JSON2SheetOpts } from "xlsx/dist/xlsx.min";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as moment from "moment-mini";


const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable()
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportPecodeAsExcel(json: any[], excelFileName: string): void {
    let options: JSON2SheetOpts = {
      header: ["serial_number", "trainer_name", "pecode", "created_at"],
    };
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, options);
    const workbook: XLSX.WorkBook = {
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

  public exportMoinitoringAsExcel(data: any, circuit: any, year): void {
    let header = [
      "Month",
      "Number of new Individuals Registered",
      "Number of Teams",
      "Tags Scanned",
      "Total Number of Steps",
      "Total Number of Points Awarded",
      "Total Miles",
    ];
    if (circuit.id == 33 || circuit.id == 39) {
      header = [
        "Month",
        "Number of new Individuals Registered",
        "Number of Teams",
        "Tags Scanned",
        "Total Number of Steps",
        "Total Number of Points Awarded",
        "Total Miles",
        "Number of Books taken out",
        "Number of Points Awarded",
      ];
    }
    var options = {
      useStyles: true,
      useSharedStrings: true,
    };
    let workbook = new Excel.Workbook(options);
    workbook.creator = "Prakhar";
    workbook.created = new Date();

    var worksheet = workbook.addWorksheet(data.month, {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    worksheet.mergeCells("B1:F1");
    worksheet.getCell(
      "C1"
    ).value = `Street Tag Monitoring Report (${circuit.circuit_name})`;
    let titleRow = worksheet.getCell("B1");
    titleRow.font = {
      name: "Calibri Light",
      family: 2,
      size: 14,
      bold: true,
    };
    titleRow.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(1).height = 22;

    worksheet.addRow(["Date : " + moment().format("ll") + " (Monthly Report)"]);
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "FF0000FF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = { name: "Arial", size: 10, family: 4, bold: true };
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
    });
    worksheet.getColumn(1).width = 16;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 17;
    worksheet.getColumn(5).width = 16;
    worksheet.getColumn(6).width = 16;
    worksheet.getColumn(7).width = 16;
    if (circuit.id == 33 || circuit.id == 39) {
      worksheet.getColumn(8).width = 16;
      worksheet.getColumn(9).width = 16;
    }
    worksheet.getRow(4).height = 30;

    //Adding data
    const propertyValues = Object.values(data);
    let Data = worksheet.addRow(propertyValues);
    Data.eachCell((cell, number) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = { name: "Arial", size: 10, family: 4, bold: true };
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      cell.numFmt = "#,##,###";
    });

    const filename = `${circuit.circuit_name}_Monitoring-Report(${data.month}-${year}).${EXCEL_EXTENSION}`;
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer().then(function (buffer) {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, filename);
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

  public async exportquesExcel(json: any[], objData : any){
    let options: JSON2SheetOpts = {
      // header: ["serial_number", "trainer_name", "pecode", "created_at"],
    };
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, options);
    const workbook: XLSX.WorkBook = {
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
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = {
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



}
