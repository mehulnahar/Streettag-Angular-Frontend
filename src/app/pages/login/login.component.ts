import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AjaxService } from '../../../ajax.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public settings: Settings;
  public hide: boolean = true;
  res: any;
  private readonly baseUrl = environment.baseUrl;
  
  constructor(
    public appSettings: AppSettings, 
    public fb: FormBuilder, 
    public router: Router,
    private ajaxService: AjaxService,
    public snackBar: MatSnackBar
  ) {
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }
 
  ngOnInit() {
    localStorage.clear();
  }

  onSubmit() {
    if (this.form.valid) {
      const url = `${this.baseUrl}auth`;
      const data = {
        "user_name": this.form.value.username,
        "passwd": this.form.value.password
      };
    
      this.ajaxService.post(data, url).subscribe({
        next: (data: any) => {
          this.res = data;
          if(this.res.status === "true" && this.res.token) {
            localStorage.setItem('JWTtoken', this.res.token);
            localStorage.setItem('username', this.form.value.username);
            
            this.snackBar.open('Login successful!', '', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['green-snackbar']
            });
            
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.form.get('password')?.reset();
            this.snackBar.open('Invalid credentials!', '', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
        },
        error: (error: any) => {
          this.form.get('password')?.reset();
          this.snackBar.open(error.error?.message || 'Login failed! Please try again.', '', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
