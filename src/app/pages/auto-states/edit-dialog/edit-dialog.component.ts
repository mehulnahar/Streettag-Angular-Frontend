import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AjaxService } from '../../../ajax.service';

interface AutoStateData {
  id: number;
  location_id: number;
  circuit_id: number;
  emails: string;
  circuit_name: string;
  location_name: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  angForm: FormGroup;
  selectedLocation: string = '';
  selectedCircuit: string = '';
  emailArray: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AutoStateData,
    private snackBar: MatSnackBar,
    private ajaxService: AjaxService
  ) {
    this.angForm = this.formBuilder.group({
      location_id: [{ value: data.location_id, disabled: true }],
      circuit_id: [{ value: data.circuit_id, disabled: true }]
    });

    // Parse the emails string into array
    try {
      this.emailArray = JSON.parse(data.emails);
    } catch (e) {
      console.error('Error parsing emails:', e);
      this.emailArray = [];
    }

    // Set location and circuit names
    this.selectedLocation = data.location_name;
    this.selectedCircuit = data.circuit_name;
  }

  ngOnInit() {}

  onSubmit() {
    if (this.emailArray.length > 0) {
      const updateData = {
        location_id: this.data.location_id,
        circuit_id: this.data.circuit_id,
        emails: this.emailArray
      };

      this.ajaxService.createAutoStates(updateData).subscribe(
        (response: any) => {
          this.snackBar.open(response.msg || 'Updated Successfully', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar']
          });
          this.dialogRef.close(1);
        },
        (error: Error) => {
          this.snackBar.open('Error updating auto state', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        }
      );
    } else {
      this.snackBar.open('Please add at least one email', 'Close', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
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
        } else {
          this.snackBar.open('Email already exists', 'Close', {
            duration: 2000
          });
        }
      } else {
        this.snackBar.open('Please enter a valid email', 'Close', {
          duration: 2000
        });
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
