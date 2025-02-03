import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  @Input() userImage: string = '';
  @Input() userInfo: boolean = false;
  
  public userName: string = 'User Name';
  public userRole: string = 'User Role';

  constructor(private router: Router) { }

  logout(){
    localStorage.removeItem('JWTtoken');  
    localStorage.removeItem('username');  
    localStorage.removeItem('password');  
    this.router.navigate(['/login']);
  }  
}
