import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {SharedService} from '../../services/shared.service'
import * as moment from 'moment-mini'
import {QuesReportService} from './ques-report.service'
import { ExcelService } from 'src/app/excel.service';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';


@Component({
  selector: 'app-ques-report',
  templateUrl: './ques-report.component.html',
  styleUrls: ['./ques-report.component.css'],
})
export class QuesReportComponent implements OnInit {
  angForm: FormGroup;
  locationArray : Observable<any>;
  circuitArray : Observable<any>;
  alwaysShowCalendars: boolean;
  public spiner : boolean;
  minDate: moment.Moment = moment().year(2000);
  maxDate: moment.Moment = moment().add(1, 'days');
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

 
  constructor(private shared : SharedService, private snackBar: MatSnackBar, 
    private fb: FormBuilder, private Quesservice : QuesReportService,private excelService: ExcelService,
    public snackbar: SnackBarComponent,
    ) { 
    this.locationArray = this.shared.getLocation();
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      location_id: ["", [Validators.required]],
      circuit_id: ["", [Validators.required]],
      date: ["", [Validators.required]]
    });
  }

  getCircuits(location_id : number){
    this.circuitArray = this.shared.getcircuit(location_id);
  }

  async onSubmit(){
    this.spiner = true;
    const reqObj = {
      location_id : this.angForm.get('location_id').value,
      circuit_id : this.angForm.get('circuit_id').value.id,
      startDate : moment(this.angForm.get('date').value.start).format('DD-MM-YYYY'), 
      endDate : moment(this.angForm.get('date').value.end).format('DD-MM-YYYY')
    }
     this.Quesservice.createExcel(reqObj).subscribe(async (result)=>{
            if(result.length == 0){
              setTimeout(() => {
                this.spiner = false;
                this.snackbar.openSnackBar("No Record Found!",'error', 2500);
              }, 2000);
            }else{
             const filenameObj ={circuit_id : this.angForm.get('circuit_id').value.circuit_name , 
               startDate : moment(this.angForm.get('date').value.start).format('DD-MM-YYYY'),
               endDate : moment(this.angForm.get('date').value.end).format('DD-MM-YYYY')
            };        
              await this.excelService.exportquesExcel(result , filenameObj ).then(()=>{
                setTimeout(() => {
                  this.spiner = false;
                }, 2000);
              }).catch((err)=>{
                this.snackbar.openSnackBar("Something wenr wrong!",'error', 2500);
              });
            }
     
          })
   
  }


}
