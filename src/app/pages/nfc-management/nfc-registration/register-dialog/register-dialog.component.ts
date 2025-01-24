import { Component, OnInit } from "@angular/core";
import {MatDialogRef} from "@angular/material"
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {Subscription } from "rxjs/Subscription";
import {
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";
import { debounceTime } from "rxjs/operators/debounceTime";
import { AjaxService } from "src/app/ajax.service";
import { SnackBarComponent } from "src/app/shared/snack-bar/snack-bar.component";
import { environment } from "src/environments/environment";
import {NfcService} from "../../nfc.service";
import { noSpecialCharAllowed ,numberNotAllowed} from "../../../../theme/utils/app-validators";

@Component({
  selector: "app-register-dialog",
  templateUrl: "./register-dialog.component.html",
  styleUrls: ["./register-dialog.component.scss"],
})
export class RegisterDialogComponent implements OnInit {
  nfcRegistrationForm: FormGroup;
  $filteredplayers: Subscription;
  filteredTeam: any[];
  private readonly baseUrl = environment.baseUrl;
  maxDate: Date;
  constructor(
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    private snackbar: SnackBarComponent,
    private dialogRef : MatDialogRef<RegisterDialogComponent>,
    private nfcService : NfcService
  ) {
    const currentDate = new Date();
    this.maxDate = new Date(currentDate);
  }

  onClose(){
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

  clearForm(){
    this.nfcRegistrationForm.reset();
    //set category "parent" as default after reset of form.
    this.nfcRegistrationForm.get('category').setValue("parent");
  }

  ngOnInit(): void {
    const playerIdRegex = /^\w*$/;
    this.nfcRegistrationForm = this.fb.group({
      player_id: ["", [Validators.required, Validators.pattern(playerIdRegex)]],
      name: ["",[Validators.required , noSpecialCharAllowed , numberNotAllowed]],
      dob: [""],
      gender: ["", [Validators.required]],
      team_id: ["", [Validators.required ]],
      team_name: ["", [Validators.required]],
      email: ["",Validators.email],
      category: ["parent"],
      circuit_id: [""],
      location_id: [""],
    });

    this.$filteredplayers = this.nfcRegistrationForm.get("team_id").valueChanges
    .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        tap(() => {
          this.filteredTeam = [];
        }),
        switchMap((value) =>
          this.ajaxService
            .post(
              { team_id: this.nfcRegistrationForm.get("team_id").value},
              `${this.baseUrl}getTeamDetails`
            )
        )
      ).subscribe((data) => {
        if (!data["response"]) {
          this.nfcRegistrationForm.controls['team_id'].markAsTouched();
          this.nfcRegistrationForm.controls['team_id'].setErrors({'incorrect': true});
          this.nfcRegistrationForm.get('team_name').setValue('');
          this.nfcRegistrationForm.get('circuit_id').setValue('');
          this.nfcRegistrationForm.get('location_id').setValue('');
        } else {
          this.nfcRegistrationForm.get('team_name').setValue(atob(data['response']['team_name']));
          this.nfcRegistrationForm.get('circuit_id').setValue(data['response']['circuit_id']);
          this.nfcRegistrationForm.get('location_id').setValue(data['response']['location_id']);
        }
      });
}

 AddPlayer(){
     this.nfcService.AddNfcPlayer(this.nfcRegistrationForm.value).subscribe((data) => {
     this.snackbar.openSnackBar(data['msg'], "success");
     this.dialogRef.close(true);
  },(error) => {
    if(error.status == 409){
      this.snackbar.openSnackBar(error.error.msg, "error");
    }else if(error.status == 400){
      this.snackbar.openSnackBar(error.error.msg, "error");
    }else{
      this.snackbar.openSnackBar();
    }
   });
 }

}
