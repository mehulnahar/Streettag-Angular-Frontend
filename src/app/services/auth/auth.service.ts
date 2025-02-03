//npm install --save @auth0/angular-jwt

import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
    providedIn: "root",
  })
export class AuthService {
  constructor(public jwtHelper: JwtHelperService) {}
  
public isAuthenticated(): boolean {
    const token = localStorage.getItem("JWTtoken");
    
    return !this.jwtHelper.isTokenExpired(token);
  }
}
