import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment-mini';

@Injectable()


export class PDFService {

  constructor() { }

  public downloadPDF(data:any , circuit:any,year){
    const documentDefinition = { 
      content:[
        {
        text:`Street Tag Monitoring Report (${circuit.circuit_name})`,
        bold: true,
        fontSize: 16,
        alignment: 'center',
        },
        {
          text:`Creation Date : ${moment().format('ll')} (Monthly Report)`,
          fontSize: 13,
          alignment: 'left',
          margin: [5, 20]
          },
          this.getTable(data,circuit.id)
      ],
      info: {
        title: 'Street Tag Monitoring Report',
        author: 'Prakhar',
        subject: 'Street Tag Monitoring Report',
        keywords: 'Street Tag Monitoring Report',
      },
      styles: {
        tableHeader: {
          bold: true,
          fillColor:'yellow',
          alignment: 'center'
        }
      }
       
    }

    const filename = `${circuit.circuit_name}_Monitoring-Report(${data.month}-${year}).pdf`;
    pdfMake.createPdf(documentDefinition).download(filename);
  }  

  getTable(data,circuit_id){
    // Adding two more column
    if(circuit_id == 33 || circuit_id == 39){
      return {
        table: {
        widths: ['auto', 'auto' , 'auto', 'auto','auto', 'auto', 'auto','auto','auto'],
        body: [
          [{
            text: 'Month',
            style: 'tableHeader',
          },
          {
            text: 'Number of new Individuals Registered',
            style: 'tableHeader',
          },
          {
            text: 'Number of Teams',
            style: 'tableHeader',
          },
          {
            text: 'Tags Scanned',
            style: 'tableHeader',
          },
          {
            text: 'Total Number of Steps',
            style: 'tableHeader',
          },
          {
            text: 'Total Number of Points Awarded',
            style: 'tableHeader',
          },
          {
            text: 'Total Miles',
            style: 'tableHeader',
          },
          {
            text: 'Number of Books taken out',
            style: 'tableHeader',
          },
          {
            text: 'Number of Points Awarded',
            style: 'tableHeader',
          }
          ],
           [data.month, data.registration, data.team, data.tag_scanned,data.steps,data.score_points,data.distance,data.libraries_books,data.libraries_points]
          ]
      }
    }
    }
    return {
      table: {
      widths: [60, 68 ,'auto', 'auto',60, 80, 60],
      body: [
        [{
          text: 'Month',
          style: 'tableHeader',
        },
        {
          text: 'Number of Individuals Registered',
          style: 'tableHeader',
        },
        {
          text: 'Number of Teams',
          style: 'tableHeader',
        },
        {
          text: 'Tags Scanned',
          style: 'tableHeader',
        },
        {
          text: 'Total Number of Steps',
          style: 'tableHeader',
        },
        {
          text: 'Total Number of Points Awarded',
          style: 'tableHeader',
        },
        {
          text: 'Total Miles',
          style: 'tableHeader',
        }
        ],
         [data.month, data.registration, data.team, data.tag_scanned,data.steps,data.score_points,data.distance]
        ]
    }
  }
}

}



