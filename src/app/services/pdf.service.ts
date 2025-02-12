import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  downloadPDF(reportData: any): void {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'MMM dd, yyyy');

    const headers = [
      'Number of new Individuals Registered',
      'Number of Teams',
      'Tag Scanned',
      'Total Number of Steps',
      'Total Number of Points Awarded',
      'Total Miles'
    ];

    if (reportData.data.length > 6) {
      headers.push('Books Taken', 'Library Points');
    }

    const tableData = headers.map((header, index) => [
      { text: header, fillColor: '#CCCCCC', margin: [0, 5, 0, 5] },
      { text: reportData.data[index].value.toString(), margin: [0, 5, 0, 5] }
    ]);

    const docDefinition = {
      content: [
        {
          text: `Street Tag Monitoring Report (${reportData.circuitName})`,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: `Creation Date : ${formattedDate} (Monthly Report)`,
          style: 'subheader',
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 0,
            widths: ['*', 100],
            body: tableData
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: false,
          margin: [0, 10, 0, 5]
        }
      },
      defaultStyle: {
        fontSize: 12
      }
    };

    pdfMake.createPdf(docDefinition).download('monitoring_report.pdf');
  }
} 