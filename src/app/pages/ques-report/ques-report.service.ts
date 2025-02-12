import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AjaxService } from 'src/app/ajax.service';
import { ExcelService } from 'src/app/excel.service';
import { environment } from 'src/environments/environment';

interface ApiResponse<T> {
  response: T;
  status: number;
  message: string;
}

interface QuestionnaireResponse {
  player_id: string;
  fullname: string;
  gender: string;
  date_of_birth: string;
  postal_code: string;
  type: number;
  created_at: string;
  question_text: string;
}

interface ReportDataItem {
  "Player Id": string;
  "Name": string;
  "Gender": string;
  "Date of Birth": string;
  "Post Code": string;
  "In the past 7 days, have you done a continuous walk lasting at least 10 minutes?": string;
  "In the past 7 days, on how many days did you do a walk lasting at least ten minutes? Please circle": string;
  "How much time did you usually spend walking on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": string;
  "Was the effort you put into walking usually enough to raise your breathing rate? Please circle": string;
  "In the past 7 days, have you done a cycle ride?": string;
  "In the past 7 days, on how many days did you do a cycle ride? Please circle": string;
  "How much time did you usually spend cycling on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": string;
  "Was the effort you put into cycling usually enough to raise your breathing rate? Please circle": string;
  "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle": string;
  "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? ": string;
  "How much time you usually spend doing sports,fitness activities, or dance on eachdat that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": string;
  "Was the effort you put into doing sport, fitness activities, or dance usually enough to raise your breathing rate? Please circle": string;
  "Where did you hear about Street Tag?": string;
  "Which one of the following best describes your ethnic group or background? (Please select one option)": string;
  "Do you have any physical or mental health conditions or illnesses that have lasted or are expected to last 12 months or more?": string;
  "Do these physical or mental health conditions or illnesses have a substantial effect on your ability to do normal daily activities?": string;
  "Does this disability or illness affect you in any of the following areas?": string;
  "What were your main reasons for playing Street Tag?": string;
  "Type": number;
  "Date": string | null;
}

@Injectable()
export class QuesReportService {
  private readonly baseUrl = environment.baseUrl;

  constructor(
    private api: AjaxService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) { }

  private createBaseReportItem(data: QuestionnaireResponse): Partial<ReportDataItem> {
    return {
      "Player Id": atob(data.player_id),
      "Name": atob(data.fullname),
      "Gender": data.gender,
      "Date of Birth": data.date_of_birth,
      "Post Code": data.postal_code,
      "Type": data.type,
      "Date": this.datePipe.transform(data.created_at, 'yyyy-MM-dd hh:mm:ss')
    };
  }

  private createEmptyAnswers(): Partial<ReportDataItem> {
    return {
      "In the past 7 days, have you done a continuous walk lasting at least 10 minutes?": "-",
      "In the past 7 days, on how many days did you do a walk lasting at least ten minutes? Please circle": "-",
      "How much time did you usually spend walking on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": "-",
      "Was the effort you put into walking usually enough to raise your breathing rate? Please circle": "-",
      "In the past 7 days, have you done a cycle ride?": "-",
      "In the past 7 days, on how many days did you do a cycle ride? Please circle": "-",
      "How much time did you usually spend cycling on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": "-",
      "Was the effort you put into cycling usually enough to raise your breathing rate? Please circle": "-",
      "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle": "-",
      "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? ": "-",
      "How much time you usually spend doing sports,fitness activities, or dance on eachdat that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": "-",
      "Was the effort you put into doing sport, fitness activities, or dance usually enough to raise your breathing rate? Please circle": "-",
      "Where did you hear about Street Tag?": "-",
      "Which one of the following best describes your ethnic group or background? (Please select one option)": "-",
      "Do you have any physical or mental health conditions or illnesses that have lasted or are expected to last 12 months or more?": "-",
      "Do these physical or mental health conditions or illnesses have a substantial effect on your ability to do normal daily activities?": "-",
      "Does this disability or illness affect you in any of the following areas?": "-",
      "What were your main reasons for playing Street Tag?": "-"
    };
  }

  createExcel(reqObject: object): Observable<ReportDataItem[]> {
    const url = `${this.baseUrl}getQuesReport`;
    const reportData: ReportDataItem[] = [];

    return this.api.post<ApiResponse<QuestionnaireResponse[]>>(reqObject, url).pipe(
      map(response => {
        response.response.forEach((data: QuestionnaireResponse) => {
          const dataJson = JSON.parse(data.question_text);
          const baseItem = this.createBaseReportItem(data);
          let reportItem: ReportDataItem;

          if (data.type === 1 || data.type === 2) {
            const subQ1 = dataJson.q1.subques;
            const subQ2 = dataJson.q2.subques;
            const subQ3 = dataJson.q3.subques;

            reportItem = {
              ...baseItem,
              ...this.createEmptyAnswers(),
              "In the past 7 days, have you done a continuous walk lasting at least 10 minutes?": dataJson.q1.ans,
              "In the past 7 days, on how many days did you do a walk lasting at least ten minutes? Please circle": subQ1.a.ans,
              "How much time did you usually spend walking on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": subQ1.b.ans,
              "Was the effort you put into walking usually enough to raise your breathing rate? Please circle": subQ1.c.ans,
              "In the past 7 days, have you done a cycle ride?": dataJson.q2.ans,
              "In the past 7 days, on how many days did you do a cycle ride? Please circle": subQ2.a.ans,
              "How much time did you usually spend cycling on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": subQ2.b.ans,
              "Was the effort you put into cycling usually enough to raise your breathing rate? Please circle": subQ2.c.ans,
              "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle": dataJson.q3.ans,
              "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? ": subQ3.a.ans,
              "How much time you usually spend doing sports,fitness activities, or dance on eachdat that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)": subQ3.b.ans,
              "Was the effort you put into doing sport, fitness activities, or dance usually enough to raise your breathing rate? Please circle": subQ3.c.ans
            } as ReportDataItem;
          } else if (data.type === 4 || data.type === 3) {
            reportItem = {
              ...baseItem,
              ...this.createEmptyAnswers(),
              "Where did you hear about Street Tag?": (data.type === 3 ? "-" : dataJson.q1.ans),
              "What were your main reasons for playing Street Tag?": (data.type === 3 ? JSON.stringify(dataJson.q1.ans) : "-")
            } as ReportDataItem;
          } else if (data.type === 5) {
            reportItem = {
              ...baseItem,
              ...this.createEmptyAnswers(),
              "Which one of the following best describes your ethnic group or background? (Please select one option)": dataJson.q1.ans,
              "Do you have any physical or mental health conditions or illnesses that have lasted or are expected to last 12 months or more?": dataJson.q2.ans,
              "Do these physical or mental health conditions or illnesses have a substantial effect on your ability to do normal daily activities?": dataJson.q3.ans,
              "Does this disability or illness affect you in any of the following areas?": dataJson.q4.ans
            } as ReportDataItem;
          } else {
            reportItem = {
              ...baseItem,
              ...this.createEmptyAnswers()
            } as ReportDataItem;
          }

          reportData.push(reportItem);
        });
        return reportData;
      })
    );
  }
}
