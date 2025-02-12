import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { QuesReportService } from './ques-report.service';
import { ExcelService } from 'src/app/excel.service';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ques-report',
  templateUrl: './ques-report.component.html',
  styleUrls: ['./ques-report.component.css'],
})
export class QuesReportComponent implements OnInit {
  angForm!: FormGroup;
  locationArray!: Observable<any>;
  circuitArray!: Observable<any>;
  public spiner!: boolean;
  minDate: Date = new Date(2000, 0, 1);
  maxDate: Date = new Date();

  constructor(
    private shared: SharedService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private Quesservice: QuesReportService,
    private excelService: ExcelService,
    public snackbar: SnackBarComponent,
    private datePipe: DatePipe
  ) {
    this.locationArray = this.shared.getLocation();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      location_id: ["", [Validators.required]],
      circuit_id: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]]
    });
  }

  getCircuits(location_id: number) {
    this.circuitArray = this.shared.getcircuit(location_id);
  }

  async onSubmit() {
    if (this.angForm.valid) {
      this.spiner = true;
      const startDate = this.datePipe.transform(this.angForm.get('startDate')?.value, 'dd-MM-yyyy');
      const endDate = this.datePipe.transform(this.angForm.get('endDate')?.value, 'dd-MM-yyyy');
      
      if (!startDate || !endDate) {
        this.snackbar.openSnackBar("Invalid date format!", 'error', 2500);
        this.spiner = false;
        return;
      }

      const circuit = this.angForm.get('circuit_id')?.value;
      const reqObj = {
        location_id: this.angForm.get('location_id')?.value,
        circuit_id: circuit.id,
        startDate,
        endDate
      };

      this.Quesservice.createExcel(reqObj).subscribe(async (result) => {
        if (result.length == 0) {
          setTimeout(() => {
            this.spiner = false;
            this.snackbar.openSnackBar("No Record Found!", 'error', 2500);
          }, 2000);
        } else {
          const filenameObj = {
            circuit_id: circuit.circuit_name,
            startDate,
            endDate
          };

          await this.excelService.exportquesExcel(result, filenameObj).then(() => {
            setTimeout(() => {
              this.spiner = false;
            }, 2000);
          }).catch((err) => {
            this.snackbar.openSnackBar("Something went wrong!", 'error', 2500);
          });
        }
      });
    }
  }
}
