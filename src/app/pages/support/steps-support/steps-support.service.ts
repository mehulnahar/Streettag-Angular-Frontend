import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface StepSupportUpdate {
  data: {
    step_support_id: number;
    feedback: number;
  }
}

interface ApiResponse {
  response: any[];
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class StepsSupportService {

  private readonly baseUrl = environment.baseUrl;
  constructor(private ajaxService : AjaxService) { }

  getStepsSupports(selectedDate: DateRange): Observable<ApiResponse> {
    const url = `${this.baseUrl}steps_support`;
    return this.ajaxService.post(selectedDate,url).pipe(
      map((response: any) => response as ApiResponse),
      retry(1)
    );
  }

  updateStepSupport(data: any, toggle: number): Observable<ApiResponse> {
    const dataObj: StepSupportUpdate = {
      data: {
        step_support_id: data.id,
        feedback: toggle
      }
    };
    const url = `${this.baseUrl}stepSupportAdmin`;
    return this.ajaxService.post(dataObj,url).pipe(
      map((response: any) => response as ApiResponse)
    );
  }
}
