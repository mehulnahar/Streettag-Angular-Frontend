import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AjaxService } from 'src/app/ajax.service';
import { ExcelService } from 'src/app/excel.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuesReportService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private api : AjaxService,private excelService: ExcelService,private datePipe: DatePipe) { }

   createExcel(reqObject : object){
     const url = `${this.baseUrl}getQuesReport`;
      let obj = [];
     return this.api.post(reqObject, url)
        .pipe(
        map(e => {
          e['response'].map(data =>{
          
           let dataJson = JSON.parse(data.question_text);
          
       if(data.type == 1 || data.type == 2){
        let subQ1 = dataJson.q1.subques;
        let subQ2 = dataJson.q2.subques;
        let subQ3 = dataJson.q3.subques;
           obj.push({
            "Player Id":atob(data.player_id),
            "Name":atob(data.fullname),
            "Gender":data.gender,
            "Date of Birth":data.date_of_birth,
            "Post Code": data.postal_code,
            "In the past 7 days, have you done a continuous walk lasting at least 10 minutes?":dataJson.q1.ans,
            "In the past 7 days, on how many days did you do a walk lasting at least ten minutes? Please circle":subQ1.a.ans,
            "How much time did you usually spend walking on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":subQ1.b.ans,
            "Was the effort you put into walking usually enough to raise your breathing rate? Please circle":subQ1.c.ans,
  
            "In the past 7 days, have you done a cycle ride?":dataJson.q2.ans,
            "In the past 7 days, on how many days did you do a cycle ride? Please circle":subQ2.a.ans,
            "How much time did you usually spend cycling on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":subQ2.b.ans,
            "Was the effort you put into cycling usually enough to raise your breathing rate? Please circle":subQ2.c.ans,
          
            "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle":dataJson.q3.ans,
            "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? ":subQ3.a.ans,
            // "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":subQ3.b.ans,
            "How much time you usually spend doing sports,fitness activities, or dance on eachdat that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":subQ3.b.ans,
            "Was the effort you put into doing sport, fitness activities, or dance usually enough to raise your breathing rate? Please circle":subQ3.c.ans,
            "Where did you hear about Street Tag?":"-",
            "Which one of the following best describes your ethnic group or background? (Please select one option)":"-",
            "Do you have any physical or mental health conditions or illnesses that have lasted or are expected to last 12 months or more?":"-",
            "Do these physical or mental health conditions or illnesses have a substantial effect on your ability to do normal daily activities?":"-",
            "Does this disability or illness affect you in any of the following areas?":'-',
            "What were your main reasons for playing Street Tag?":"-",
            "Type":data.type,
            "Date":this.datePipe.transform(data.created_at,'yyyy-MM-dd hh:mm:ss') 
            //  "Date":data.created_at 
  
          });
       }
  
       if(data.type == 4 || data.type == 3){
        obj.push({
        "Player Id":atob(data.player_id),
        "Name":atob(data.fullname),
        "Gender":data.gender,
        "Date of Birth":data.date_of_birth,
        "Post Code": data.postal_code,
        "In the past 7 days, have you done a continuous walk lasting at least 10 minutes?":"-",
        "In the past 7 days, on how many days did you do a walk lasting at least ten minutes? Please circle":"-",
        "How much time did you usually spend walking on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":"-",
        "Was the effort you put into walking usually enough to raise your breathing rate? Please circle":"-",
  
        "In the past 7 days, have you done a cycle ride?":"-",
        "In the past 7 days, on how many days did you do a cycle ride? Please circle":"-",
        "How much time did you usually spend cycling on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":"-",
        "Was the effort you put into cycling usually enough to raise your breathing rate? Please circle":"-",
      
        "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle":"-",
        "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? ":"-",
        "How much time you usually spend doing sports,fitness activities, or dance on eachdat that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":"-",
        "Was the effort you put into doing sport, fitness activities, or dance usually enough to raise your breathing rate? Please circle":"-",
        "Where did you hear about Street Tag?":(data.type == 3 ? "-" : dataJson.q1.ans) ,
        "Which one of the following best describes your ethnic group or background? (Please select one option)":"-",
        "Do you have any physical or mental health conditions or illnesses that have lasted or are expected to last 12 months or more?":"-",
        "Do these physical or mental health conditions or illnesses have a substantial effect on your ability to do normal daily activities?":"-",
        "Does this disability or illness affect you in any of the following areas?":'-',
        "What were your main reasons for playing Street Tag?": (data.type == 3 ? JSON.stringify(dataJson.q1.ans) : "-"),
        "Type":data.type,
        "Date":this.datePipe.transform(data.created_at,'yyyy-MM-dd hh:mm:ss') 
        
      });
       }
  
       if(data.type == 5){
        obj.push({
        "Player Id":atob(data.player_id)  ,
        "Name":atob(data.fullname),
        "Gender":data.gender,
        "Date of Birth":data.date_of_birth,
        "Post Code": data.postal_code,
        "In the past 7 days, have you done a continuous walk lasting at least 10 minutes?":"-",
        "In the past 7 days, on how many days did you do a walk lasting at least ten minutes? Please circle":"-",
        "How much time did you usually spend walking on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":"-",
        "Was the effort you put into walking usually enough to raise your breathing rate? Please circle":"-",
  
        "In the past 7 days, have you done a cycle ride?":"-",
        "In the past 7 days, on how many days did you do a cycle ride? Please circle":"-",
        "How much time did you usually spend cycling on each day that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":"-",
        "Was the effort you put into cycling usually enough to raise your breathing rate? Please circle":"-",
      
        "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? Please circle":"-",
        "In the past 7 days, on how many days did you do a sport, fitness activity (such as gym or fitness classes), or dance? ":"-",
        "How much time you usually spend doing sports,fitness activities, or dance on eachdat that you did the activity? (If over an hour, still write in minutes (e.g. 1 hour + 10 minutes = 70)":"-",
        "Was the effort you put into doing sport, fitness activities, or dance usually enough to raise your breathing rate? Please circle":"-",
        "Where did you hear about Street Tag?":"-",
        "Which one of the following best describes your ethnic group or background? (Please select one option)":dataJson.q1.ans,
        "Do you have any physical or mental health conditions or illnesses that have lasted or are expected to last 12 months or more?":dataJson.q2.ans,
        "Do these physical or mental health conditions or illnesses have a substantial effect on your ability to do normal daily activities?":dataJson.q3.ans,
        "Does this disability or illness affect you in any of the following areas?":dataJson.q4.ans,
        "Type":data.type,
        "Date":this.datePipe.transform(data.created_at,'yyyy-MM-dd hh:mm:ss') 
       });
       }
       
   })
          return obj;
        })
      )}


}
