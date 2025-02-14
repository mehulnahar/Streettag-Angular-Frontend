import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AjaxService } from '../../../ajax.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {
  angForm: FormGroup;
  emailArray: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA];
  dataSourceLocation$: Observable<any>;
  dataSourceCircuit$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private snackBar: MatSnackBar,
    private ajaxService: AjaxService
  ) {
    this.angForm = this.formBuilder.group({
      location_id: ['', Validators.required],
      circuit_id: ['', Validators.required]
    });

    this.dataSourceLocation$ = this.ajaxService.getLocations().pipe(
      map((response: any) => {
        if (response && response.status === 'true' && Array.isArray(response.response)) {
          return response.response.sort((a: any, b: any) => a.serial_number - b.serial_number);
        }
        return [];
      })
    );
    this.dataSourceCircuit$ = new Observable<any>();
  }

  ngOnInit() {}

  onSubmit() {
    if (this.angForm.valid && this.emailArray.length > 0) {
      const data = {
        location_id: this.angForm.value.location_id,
        circuit_id: this.angForm.value.circuit_id,
        emails: this.emailArray
      };

      this.ajaxService.addAutoState(data).subscribe(
        (response: any) => {
          this.snackBar.open(response.msg, 'Close', {
            duration: 2000
          });
          this.dialogRef.close(1);
        },
        (error: Error) => {
          this.snackBar.open('Error adding auto state', 'Close', {
            duration: 2000
          });
        }
      );
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  add(event: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (this.validateEmail(value.trim())) {
        if (!this.emailArray.includes(value.trim())) {
          this.emailArray.push(value.trim());
        }
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(email: string): void {
    const index = this.emailArray.indexOf(email);
    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }

  get_location_id(id: number) {
    this.dataSourceCircuit$ = this.ajaxService.getCircuitsByLocation(id);
  }

  clearForm() {
    this.angForm.reset();
    this.emailArray = [];
  }

  close() {
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
