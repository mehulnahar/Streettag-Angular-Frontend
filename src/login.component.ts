import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AppSettings } from '../../app.settings';
import {AjaxService} from '../../ajax.service';
import { Settings } from '../../app.settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;
  res:any;
  private readonly baseUrl = environment.baseUrl;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router,private ajaxService: AjaxService,public snackBar: MatSnackBar){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required])],
      // 'rememberMe': false
    });
  }
 
  ngOnInit() {
    localStorage.clear();
  }

  onSubmit()
   {
     
      const url = `${this.baseUrl}auth`;
     // const url = `http://52.56.93.181:3000/api/admin/auth`;
      var datac = {
        "user_name":this.form.value.email,
        "passwd":this.form.value.password
      };
    
      this.ajaxService.post(datac,url).subscribe(
        data => {
          this.res = data;
          if(this.res.status == "true"){
            localStorage.setItem('username', this.form.value.email);
            localStorage.setItem('password', this.form.value.password);
            localStorage.setItem('JWTtoken',this.res.token);
            this.router.navigate(['/admin/dashboard']);
          }
          else{
            this.form.get('password').reset();
            this.snackBar.open('Invalid User Name or Password! ', null, {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar'] 
          });
        }
        },
        error => {
          this.snackBar.open('Failed to load!', null, {
            duration: 2000, 
            verticalPosition: 'top',
            panelClass: ['red-snackbar']  
          });
        });
    

  }


  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

 
}