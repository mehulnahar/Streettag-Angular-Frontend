import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    getLocation<T>(url: string): Observable<T> {
        // set header to let HTTP_INTERCEPTORS know to handle or not.
        const option = {  
            headers: new HttpHeaders({ 'Anonymous': '' }) 
        }
        return this.http.get<T>(url, option);
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
}
