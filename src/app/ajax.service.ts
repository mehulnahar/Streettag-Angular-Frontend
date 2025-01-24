import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
/**/
const httpOptionsFormdata = {
    headers: new HttpHeaders({})
};

@Injectable()
export class AjaxService {

    constructor(public http: HttpClient) { }

    get(url) {
        let option = {  
            headers: new HttpHeaders({  
                'Content-Type': 'application/json; charset=utf-8', 
                })  
    }
        return this.http.get(url,option);
    }

    getdata(data, url) {

        return this.http.get(data, url);
    }

    post(data, url) {
        let option = {  
            headers: new HttpHeaders({  
                'Content-Type': 'application/json; charset=utf-8', 
                })  
        }
        let body = JSON.stringify(data);
        return this.http.post(url, body, option);
    }
    postone(data, url) {
        return this.http.post(url, data, httpOptionsFormdata);
    }

    getLocation(url){
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
