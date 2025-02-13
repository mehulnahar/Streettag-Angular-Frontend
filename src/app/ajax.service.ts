import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { pluck } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
/**/
const httpOptionsFormdata = {
    headers: new HttpHeaders({})
};

@Injectable({
  providedIn: 'root'
})
export class AjaxService {
    private baseUrl = environment.baseUrl;
    private defaultHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An error occurred';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.error?.message || `Error Code: ${error.status}`;
        }
        return throwError(() => new Error(errorMessage));
    }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(url, { headers: this.defaultHeaders })
            .pipe(catchError(this.handleError));
    }

    getdata<T>(params: any, url: string): Observable<T> {
        return this.http.get<T>(url, {
            params,
            headers: this.defaultHeaders
        }).pipe(catchError(this.handleError));
    }

    post<T>(data: any, url: string): Observable<T> {
        return this.http.post<T>(url, data, { 
            headers: this.defaultHeaders 
        }).pipe(catchError(this.handleError));
    }

    postone<T>(data: any, url: string): Observable<T> {
        // For form-data requests, let browser set content-type
        const headers = new HttpHeaders();
        return this.http.post<T>(url, data, { headers })
            .pipe(catchError(this.handleError));
    }

    // Add method for public endpoints (no auth required)
    public<T>(url: string): Observable<T> {
        const headers = this.defaultHeaders.append('Anonymous', 'true');
        return this.http.get<T>(url, { headers })
            .pipe(catchError(this.handleError));
    }

    getLocation(url: string): Observable<any> {
        // Remove content-type header to allow CORS preflight to succeed
        const headers = new HttpHeaders({
            'Accept': '*/*'
        });
        
        return this.http.get(url, { 
            headers,
            // Allow credentials and specify response type
            withCredentials: false,
            responseType: 'json'
        }).pipe(
            catchError(this.handleError)
        );
    }

    postFile<T>(data: any, url: string, file: File): Observable<T> {
        const formData: FormData = new FormData();
        formData.append("Image", file, file.name);
        return this.http.post<T>(url, formData);
    }

    // public uploadImage(image: File) {
    //     const formData = new FormData();

    //     formData.append('image', image);

    //     return this.http.post('http://185.106.129.16:1347/fitnessApp/Upload', formData);
    // }

    getLocations(): Observable<any> {
        const url = `${this.baseUrl}getLocations`;
        return this.get(url);
    }

    getCircuits(locationId: string): Observable<any> {
        const url = `${this.baseUrl}getCircuitByLocation`;
        return this.post({ location_id: locationId }, url);
    }

    getMonitoringReport(params: any): Observable<any> {
        return this.post(params, `${this.baseUrl}getMonitoring`);
    }

    // Chart Data Methods
    getStepsChartData(params: any): Observable<any> {
        return this.post(params, `${this.baseUrl}getStepsChartData`);
    }

    getStepsLineData(params: any): Observable<any> {
        return this.post(params, `${this.baseUrl}getStepsLineData`);
    }

    getStepsBarData(params: any): Observable<any> {
        return this.post(params, `${this.baseUrl}getStepsBarData`);
    }

    getParticipants(params: any): Observable<any> {
        return this.post(params, `${this.baseUrl}getParticipants`);
    }

    downloadChartData(params: any): Observable<Blob> {
        return this.http.post(`${this.baseUrl}downloadChartData`, params, {
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.ms-excel'
            })
        });
    }

    getPieChartData(params: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/chart/pie`, params);
    }

    getLineChartData(params: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/chart/line`, params);
    }

    getBarChartData(params: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/chart/bar`, params);
    }

    getNewPlayersData(params: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/chart/new-players`, params);
    }

    getLocationById(locationId: number): Observable<any> {
        const url = `${this.baseUrl}getLocation`;
        return this.post({ id: locationId }, url).pipe(pluck('response'));
    }

    getCircuitById(circuitId: number): Observable<any> {
        const url = `${this.baseUrl}getCircuit`;
        return this.post({ id: circuitId }, url).pipe(pluck('response'));
    }

    getCircuitsByLocation(locationId: number): Observable<any> {
        const url = `${this.baseUrl}getCircuitByLocation`;
        return this.post({ location_id: locationId }, url).pipe(pluck('response'));
    }

    addAutoState(data: any): Observable<any> {
        const url = `${this.baseUrl}createAutoStates`;
        return this.post(data, url);
    }

    updateAutoState(data: any): Observable<any> {
        const url = `${this.baseUrl}updateAutoState`;
        return this.post(data, url);
    }

    createAutoStates(data: any): Observable<any> {
        const url = `${this.baseUrl}createAutoStates`;
        return this.post(data, url);
    }
}
