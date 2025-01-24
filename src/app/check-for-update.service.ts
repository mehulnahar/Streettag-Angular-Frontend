import { ApplicationRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import {first } from 'rxjs/operators';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from './shared/confirm-dialog/confirmDialog.model';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService  {

  constructor(private update: SwUpdate, private appRef: ApplicationRef,private dialog: MatDialog,
    private snackbar :MatSnackBar
    ) {
   }

  checkUpdate() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled.');
      return;
    }
     // Allow the app to stabilize first, before starting polling for updates with `interval()`.
     const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
     const everySixHours$ = interval(1 * 60 * 60 * 1000);//1 hour
     const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
     everySixHoursOnceAppIsStable$.subscribe(() => this.update.checkForUpdate());
   
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled.');
      return;
    }

    this.update.available.subscribe((event) => {
      console.log(`current`, event.current, `available `, event.available);
        this.update.activateUpdate().then(() => {
      const message = "New Update Available for the app please conform";
      const dialogData = new ConfirmDialogModel("New Update Found", message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "700px",
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((result)=>{
        if(result == true){
         location.reload();
        }
      })
    });

    });
  }

  
}
