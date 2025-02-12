import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AjaxService } from "src/app/ajax.service";

interface ApiResponse<T> {
  response: T;
  status: number;
  message: string;
}

interface Location {
  id: number;
  location_name: string;
}

interface Circuit {
  id: number;
  circuit_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private api: AjaxService) { }

  getLocation(): Observable<Location[]> {
    const url = `${this.baseUrl}getLocations`;
    return this.api.get<ApiResponse<Location[]>>(url).pipe(
      map(response => response.response)
    );
  }

  getcircuit(location_id: number): Observable<Circuit[]> {
    const url = `${this.baseUrl}getCircuitByLocation`;
    const data = {
      location_id: location_id,
    };
    return this.api.post<ApiResponse<Circuit[]>>(data, url).pipe(
      map(response => response.response)
    );
  }
}


