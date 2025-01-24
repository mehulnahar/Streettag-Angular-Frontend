import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
  Inject,
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  emailValidator,
  matchingPasswords,
} from "../../theme/utils/app-validators";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";
import { AjaxService } from "src/app/ajax.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dynamiclead",
  templateUrl: "./dynamiclead.component.html",
  styleUrls: ["./dynamiclead.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class DynamicleadComponent {
  public form: FormGroup;
  public settings: Settings;

  dataSource2: any;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    private ajaxService: AjaxService,
    private activatedRoute: ActivatedRoute,
    public appSettings: AppSettings,
    public fb: FormBuilder,
    public router: Router
  ) {
    //alert(111);
    this.settings = this.appSettings.settings;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.onSubmit(params);
    });
  }

  onSubmit(data) {
    //this.spinner = true;
    //var data = {circuit_name: "35", location_name: "29"}
    //console.log(data);

    const url = `${this.baseUrl}getLeaderboardData`;

    this.ajaxService.post(data, url).subscribe((data) => {
      ////console.log(data['response']);

      this.dataSource2 = data["response"];
      //console.log(this.dataSource2);

      //setTimeout(function(){  this.spinner = false; }, 10000);
    });

    return false;
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
