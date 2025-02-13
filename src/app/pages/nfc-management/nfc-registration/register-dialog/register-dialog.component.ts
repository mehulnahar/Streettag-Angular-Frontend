import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NfcService } from '../../nfc.service';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  nfcRegistrationForm: FormGroup = this.formBuilder.group({
    player_id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    team_id: ['', [Validators.required]],
    team_name: [''],
    category: ['parent'],
    circuit_id: ['2'],
    location_id: ['2']
  });
  maxDate: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    private nfcService: NfcService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.setupTeamSearch();
  }

  private initForm() {
    this.nfcRegistrationForm = this.formBuilder.group({
      player_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      team_id: ['', [Validators.required]],
      team_name: [''],
      category: ['parent'],
      circuit_id: ['2'],
      location_id: ['2']
    });
  }

  private setupTeamSearch() {
    this.nfcRegistrationForm.get('team_id')?.valueChanges
      .subscribe(value => {
        if (value && value.toString().length > 0) {
          this.searchTeam(value);
        }
      });
  }

  searchTeam(searchKey: string) {
    this.nfcService.searchTeam({ team_id: searchKey })
      .subscribe({
        next: (data: any) => {
          if (!data.response) {
            this.nfcRegistrationForm.patchValue({
              team_name: ''
            });
          } else {
            this.nfcRegistrationForm.patchValue({
              team_name: atob(data.response.team_name)
            });
          }
        },
        error: (error) => {
          console.error('Error searching team:', error);
          this.snackBar.open('Error searching team', 'Close', { duration: 3000 });
        }
      });
  }

  clearForm() {
    this.nfcRegistrationForm.reset({
      category: 'parent',
      circuit_id: '2',
      location_id: '2'
    });
  }

  AddPlayer() {
    if (this.nfcRegistrationForm.valid) {
      const formData = this.nfcRegistrationForm.value;
      
      // Create payload with encoded values and correct types
      const payload = {
        player_id: btoa(formData.player_id.trim()),
        name: btoa(formData.name.trim()),
        email: btoa(formData.email.trim()),
        dob: formData.dob ? this.formatDate(formData.dob) : '',
        gender: formData.gender,
        team_id: Number(formData.team_id),
        category: formData.category,
        circuit_id: Number(formData.circuit_id),
        location_id: Number(formData.location_id)
      };

      this.nfcService.AddNfcPlayer(payload).subscribe({
        next: (response: any) => {
          // Check for specific error messages in response
          if (response.status === 'true' && response.msg === 'Player ID already exist.') {
            this.dialogRef.close(response.msg);
            return;
          }

          // Handle success cases
          if (response.status === 'success' || response.statusCode === 201 || response.status === 201) {
            this.snackBar.open('Player registered successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            // Handle other error cases
            const errorMessage = response.msg || response.message || 'Registration failed';
            this.dialogRef.close(errorMessage);
          }
        },
        error: (error) => {
          const errorMessage = error.error?.msg || error.error?.message || 'Error registering player';
          console.error('Error:', error);
          this.dialogRef.close(errorMessage);
        }
      });
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const date_num = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${date_num}/${month}/${year}`;
  }

  onClose() {
    this.dialogRef.close();
  }
}
