import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { format } from 'date-fns';

// Import vfs fonts
import 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PDFService {
  constructor() {
    // Ensure fonts are loaded
    if (typeof window !== 'undefined' && (window as any).pdfMake) {
      const pdfMakeInstance = (window as any).pdfMake;
      if (pdfMakeInstance && !pdfMakeInstance.vfs) {
        pdfMakeInstance.vfs = pdfMake.vfs;
      }
    }
  }

  downloadPDF(reportData: any) {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'MMM dd, yyyy');

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: `Street Tag Monitoring Report (${reportData.circuitName})`,
          style: 'header',
          alignment: 'center'
        },
        {
          text: `Creation Date : ${formattedDate} (Monthly Report)`,
          style: 'subheader',
          margin: [0, 10, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Month', style: 'tableHeader', fillColor: '#ffeb3b' },
                { text: 'Number of\nIndividuals\nRegistered', style: 'tableHeader', fillColor: '#ffeb3b' },
                { text: 'Number of\nTeams', style: 'tableHeader', fillColor: '#ffeb3b' },
                { text: 'Tags\nScanned', style: 'tableHeader', fillColor: '#ffeb3b' },
                { text: 'Total\nNumber of\nSteps', style: 'tableHeader', fillColor: '#ffeb3b' },
                { text: 'Total Number\nof Points\nAwarded', style: 'tableHeader', fillColor: '#ffeb3b' },
                { text: 'Total Miles', style: 'tableHeader', fillColor: '#ffeb3b' }
              ],
              [
                reportData.month,
                reportData.data[0].value.toString(),
                reportData.data[1].value.toString(),
                reportData.data[2].value.toString(),
                reportData.data[3].value.toString(),
                reportData.data[4].value.toString(),
                reportData.data[5].value.toString()
              ]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          alignment: 'center'
        }
      },
      defaultStyle: {
        fontSize: 12,
        alignment: 'center'
      }
    };

    pdfMake.createPdf(docDefinition).download('monitoring-report.pdf');
  }
} 