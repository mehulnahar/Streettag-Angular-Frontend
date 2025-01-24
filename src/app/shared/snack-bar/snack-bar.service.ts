import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private snackbarSubject = new Subject<any>();
  public snackbarState = this.snackbarSubject.asObservable();

  constructor(private sb :MatSnackBar) { 
   }
  show(message: string, type?: string) {
    this.sb.open(message, null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: ["red-snackbar"],
    });
  }

}
