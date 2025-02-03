import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private router: Router, private snackBar: MatSnackBar) {}
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip token for login/public endpoints
        if (request.headers.get('Anonymous') !== undefined) {
            const newHeaders = request.headers.delete('Anonymous');
            const newRequest = request.clone({ headers: newHeaders });
            return next.handle(newRequest);
        }

        const token = localStorage.getItem("JWTtoken");
        
        if (token) {
            // Clone the request and add auth headers
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return next.handle(request).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 403 || error.status === 401) {
                        // Clear token and redirect to login for auth errors
                        localStorage.removeItem('JWTtoken');
                        this.router.navigate(["/login"]);
                        this.snackBar.open("Session expired. Please login again.", "", {
                            duration: 3000,
                            verticalPosition: "top",
                            panelClass: ["red-snackbar"],
                        });
                    } else {
                        this.snackBar.open(error.error?.message || "An error occurred", "", {
                            duration: 3000,
                            verticalPosition: "top",
                            panelClass: ["red-snackbar"],
                        });
                    }
                    return throwError(() => error);
                })
            );
        } else {
            // If no token and not a public route, redirect to login
            this.router.navigate(["/login"]);
            this.snackBar.open("Please login to continue", "", {
                duration: 2000,
                verticalPosition: "top",
                panelClass: ["red-snackbar"],
            });
            return throwError(() => new Error('No authentication token'));
        }
    }
}