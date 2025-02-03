import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AjaxService } from 'src/app/ajax.service';

interface Circuit {
  id: string;
  circuit_name: string;
  location_name: string;
  location_id: string;
  start_date: string;
  end_date: string;
  serial_number?: number;
}

interface Location {
  id: string;
  location_name: string;
  created_at: string;
}

interface CircuitResponse {
  response: Circuit[];
  status?: string;
  msg?: string;
}

interface LocationResponse {
  response: Location[];
  status?: string;
  msg?: string;
}

@Component({
  selector: 'dialog-overview-addmessage-dialog',
  templateUrl: './dialog-overview-addmessage-dialog.html',
  styleUrls: ['./circuit.component.scss']
})
export class DialogOverviewAddMessageDialogCircuit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dataSourceLocation: Location[] = [];
  public dataSource!: MatTableDataSource<Circuit>;
  public displayedColumns = ['serialno', 'location_name', 'date', 'action'];

  location_name = '';
  circuit_name = '';
  start_date = '';
  end_date = '';
  resData: any;
  angForm: FormGroup;

  private readonly baseUrl = environment.baseUrl;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewAddMessageDialogCircuit>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.angForm = this.createForm();
    this.getallLocations();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getallCircuits() {
    const url = `${this.baseUrl}getCircuits`;

    this.ajaxService.get<CircuitResponse>(url).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Circuit>(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getallLocations() {
    const url = `${this.baseUrl}getLocations`;

    this.ajaxService.get<LocationResponse>(url).subscribe((data) => {
      this.dataSourceLocation = data.response;
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      circuit_name: ['', [Validators.required]],
      location_name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  addevent() {
    if (this.angForm.valid) {
      const url = `${this.baseUrl}addCircuit`;
      const data = {
        location_name: this.location_name,
        circuit_name: this.circuit_name,
        start_date: this.start_date,
        end_date: this.end_date,
      };

      this.ajaxService.post(data, url).subscribe((response: any) => {
        this.resData = response;
        this.getallCircuits();
        
        const dynamicSnackColor = this.resData.status === 'false' ? 'red-snackbar' : 'blue-snackbar';
        
        this.snackBar.open(this.resData.msg, undefined, {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: dynamicSnackColor,
        });

        this.dialogRef.close();
      });
    }
  }
} 