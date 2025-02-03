import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { AjaxService } from 'src/app/ajax.service';

interface Location {
  id: string;
  location_name: string;
  created_at: string;
}

interface LocationResponse {
  response: Location[];
  status?: string;
  msg?: string;
}

@Component({
  selector: 'dialog-overview-message-dialog',
  templateUrl: './dialog-overview-message-dialog.html',
  styleUrls: ['./circuit.component.scss']
})
export class DialogOverviewMessageDialogCircuit {
  location_name = '';
  circuit_name = '';
  circuit_id = '';
  location_id = '';
  start_date = '';
  end_date = '';
  resData: any;
  public dataSourceLocation: Location[] = [];
  angForm: FormGroup;

  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewMessageDialogCircuit>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.angForm = this.createForm();

    this.location_name = this.data.event.location_name;
    this.circuit_name = this.data.event.circuit_name;
    this.circuit_id = this.data.event.id;
    this.location_id = this.data.event.location_id;
    this.start_date = this.data.event.start_date;
    this.end_date = this.data.event.end_date;

    this.getallLocations();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;

    this.ajaxService.get<LocationResponse>(url).subscribe((data) => {
      this.dataSourceLocation = data.response;
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      circuit_name: ['', Validators.required],
      location_name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  updateevent() {
    if (this.angForm.valid) {
      const url = `${this.baseUrl}editCircuit`;
      const data = {
        circuit_id: this.circuit_id,
        circuit_name: this.circuit_name,
        location_name: this.location_name,
        start_date: this.start_date,
        end_date: this.end_date,
      };
    
      this.ajaxService.post(data, url).subscribe((response: any) => {
        this.resData = response;

        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: 'top',
        });

        this.dialogRef.close();
      });
    }
  }
} 