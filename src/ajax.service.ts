import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

    constructor(public http: HttpClient) { }

    get(url: string): Observable<any> {
        let option = {  
            headers: new HttpHeaders({  
                'Content-Type': 'application/json; charset=utf-8', 
            })  
        }
        return this.http.get(url, option);
    }

    getdata(data: any, url: string): Observable<any> {
        const params = new HttpParams({ fromObject: data });
        return this.http.get(url, { params });
    }

    post(data: any, url: string): Observable<any> {
        let option = {  
            headers: new HttpHeaders({  
                'Content-Type': 'application/json; charset=utf-8', 
            })  
        }
        let body = JSON.stringify(data);
        return this.http.post(url, body, option);
    }
    postone(data: any, url: string): Observable<any> {
        return this.http.post(url, data, httpOptionsFormdata);
    }

    getLocation(url: string): Observable<any> {
        // set header to let HTTP_INTERCEPTORS know to handle or not.
          const option = {  
            headers: new HttpHeaders({ 'Anonymous': '' }) 
          }
            return this.http.get(url,option);
    }

    postFile(data: Object, url: string, file: File) {
        console.log("this is function calling hnowerwrewefsfsfs");
        const endpoint = url;
        const formData: FormData = new FormData();
        formData.append("Image", file, file.name);
        console.log(formData);
        return this.http.post(endpoint, formData, httpOptionsFormdata);
    }

    // public uploadImage(image: File) {
    //     const formData = new FormData();

    //     formData.append('image', image);

    //     return this.http.post('http://185.106.129.16:1347/fitnessApp/Upload', formData);
    // }
}
