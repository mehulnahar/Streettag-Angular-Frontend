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
          if(this.res.status === "true") {
            localStorage.setItem('username', this.form.value.username);
            localStorage.setItem('password', this.form.value.password);
            localStorage.setItem('JWTtoken', this.res.token);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.form.get('password')?.reset();
            this.snackBar.open('Invalid User Name or Password!', '', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar'] 
            });
          }
        },
        error: (error: any) => {
          this.snackBar.open('Failed to load!', '', {
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
