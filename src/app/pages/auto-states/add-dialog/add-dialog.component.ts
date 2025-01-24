import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/observable';
import { pluck } from 'rxjs/operators/pluck';
import { AjaxService } from 'src/app/ajax.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {
  public angForm: FormGroup;
  public dataSource: any;
  public dataSourceLocation$: Observable<any>;
  public dataSourceCircuit$:Observable<any>;
  private readonly baseUrl = environment.baseUrl;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailArray = [];

  constructor(private fb: FormBuilder,private ajaxService: AjaxService, private snackBar: MatSnackBar,  private dialogRef : MatDialogRef<AddDialogComponent>) { }

  ngOnInit() {
    this.createForm();
    this.getallLocation();
  }

  createForm() {
    this.angForm = this.fb.group({
      location_id: ["", [Validators.required]],
      circuit_id: ["", [Validators.required]],
    });
  }

  onSubmit(){
    const url = `${this.baseUrl}createAutoStates`;
    const reqObj = {
      location_id: this.angForm.value.location_id,
      circuit_id: this.angForm.value.circuit_id.id,
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

  getallLocation() {
    const url = `${this.baseUrl}getLocations`;
    this.dataSourceLocation$ =this.ajaxService.get(url).pipe(pluck('response'))
  }

  get_location_id(res) {
    this.angForm.controls["circuit_id"].setValue("");
    this.dataSourceCircuit$ = null;
    const url = `${this.baseUrl}getCircuitByLocation`;
    var data1 = {
      location_id: res,
    };
    this.dataSourceCircuit$ = this.ajaxService.post(data1, url).pipe(pluck('response'));
  }

  clearForm(){
    this.angForm.reset();
    this.emailArray = [];
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
