import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { pluck } from 'rxjs/operators/pluck';
import { environment } from 'src/environments/environment';
import { AjaxService } from "src/app/ajax.service";


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly baseUrl = environment.baseUrl;


  constructor(private api : AjaxService) { }

  getLocation(): Observable<any> {
    const url = `${this.baseUrl}getLocations`;
    return this.api.get(url).pipe(pluck('response'));
  }

  getcircuit(location_id : number) {
    const url = `${this.baseUrl}getCircuitByLocation`;
    let data = {
      location_id: location_id,
    };
    return this.api.post(data, url).pipe(pluck('response'));
  }

}


