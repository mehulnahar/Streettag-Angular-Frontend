import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      localStorage.clear();
      this.router.navigate(["access-denined"]);
      return false;
    }

    return true;
  }


}
