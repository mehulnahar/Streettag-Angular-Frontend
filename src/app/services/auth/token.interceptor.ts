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
        // Skip token for login endpoint
        if (request.url.includes('/auth')) {
            const authRequest = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                }
            });
            return next.handle(authRequest);
        }

        const token = localStorage.getItem("JWTtoken");
        
        if (token) {
            // Clone the request and add auth headers
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            return next.handle(request).pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // Success handling if needed
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 403 || error.status === 401) {
                        // Clear token and redirect to login for auth errors
                        localStorage.clear();
                        this.router.navigate(["/login"]);
                        this.snackBar.open("Session expired. Please login again.", "", {
                            duration: 3000,
                            verticalPosition: "top",
                            panelClass: ["red-snackbar"],
                        });
                    } else if (error.status === 0) {
                        // CORS or network error
                        this.snackBar.open("Network error or CORS issue. Please check server connection.", "", {
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
            return throwError(() => new Error('No authentication token'));
        }
    }
}