import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private router: Router,private snackBar: MatSnackBar) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if Anonymous header detect delete all the header request 
    if (request.headers.get('Anonymous') != undefined) {
        const newHeaders = request.headers.delete('Anonymous')
        const newRequest = request.clone({ headers: newHeaders });
        return next.handle(newRequest);
    }

    request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`
        }
    });
    
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          this.router.navigate(["/login"]);
            this.snackBar.open("Session Timed Out! Please Login", null, {
                duration: 2000,
                verticalPosition: "top",
                panelClass: ["red-snackbar"],
              });
        }
      }
    });
  }
}