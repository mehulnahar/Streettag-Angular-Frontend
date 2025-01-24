import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  public angForm: FormGroup;
  public selectedLocation : string ;
  public selectedCircuit : string ;
  public emailArray : any; 
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  protected readonly baseUrl = environment.baseUrl;
    constructor(
      @Optional() @Inject(MAT_DIALOG_DATA) public data : any,
      private ajaxService: AjaxService, private snackBar: MatSnackBar,
      private dialogRef : MatDialogRef<EditDialogComponent>
    ){
      this.emailArray = JSON.parse(data.emails);
    }

    ngOnInit() {}

    onSubmit(){
      const url = `${this.baseUrl}createAutoStates`;
      const reqObj = {
        location_id: this.data.location_id,
        circuit_id: this.data.circuit_id,
        emails : this.emailArray
      };
      this.ajaxService.post(reqObj, url).subscribe(
        (data : any) => {
          this.snackBar.open(data.msg, null, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["blue-snackbar"],
          });
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBar.open("Unknown Error!", null, {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        }
      )
    }


    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  
    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
  
      if ((value || '').trim()) {
        if (this.validateEmail(value)) {
          if (!this.emailArray.includes(value)){
            this.emailArray.push(value.trim());
            }
          }
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
      }
    }

    remove(email): void {
      const index = this.emailArray.indexOf(email);
  
      if (index >= 0) {
        this.emailArray.splice(index, 1);
      }
    }

    close(){
      document
      .getElementsByClassName('animate__animated')[0]
      .classList.remove('animate__zoomIn');
    document
      .getElementsByClassName('animate__animated')[0]
      .classList.add('animate__zoomOut');
    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
    }
  
}
