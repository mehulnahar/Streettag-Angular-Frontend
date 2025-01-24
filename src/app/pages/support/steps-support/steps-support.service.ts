import { Injectable } from '@angular/core';
import * as moment from 'moment-mini';
import { retry } from 'rxjs/operators';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StepsSupportService {

  private readonly baseUrl = environment.baseUrl;
  constructor(private ajaxService : AjaxService) { }

  getStepsSupports(Selecteddate){
    const url = `${this.baseUrl}steps_support`;
    return this.ajaxService.post(Selecteddate,url).pipe(retry(1));
  }

  updateStepSupport(data,toggle){
    let dataobj = { 
      "data":
      {
      "step_support_id":data.id,
      "feedback": toggle 
      }
  };
    const url = `${this.baseUrl}stepSupportAdmin`;
    return this.ajaxService.post(dataobj,url)
  }
}
