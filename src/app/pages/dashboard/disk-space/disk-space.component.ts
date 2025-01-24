import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/app/ajax.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-disk-space",
  templateUrl: "./disk-space.component.html",
  styleUrls: ["./disk-space.component.scss"],
})
export class DiskSpaceComponent implements OnInit {
  public dataSourceLocation: any;
  public dataSourceTeam: any;
  public dataSourceTeamDataAnalysis: any;

  public dailyMiles: any;
  public weeklyMiles: any;
  public monthlyMiles: any;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.getallLocation();
  }

  getallLocation() {
    var url = `${this.baseUrl}getLocations`;

    this.ajaxService.get(url).subscribe((data) => {
      this.dataSourceLocation = data["response"];
      //console.log(this.dataSourceLocation);
    });
  }

  get_location_id(res) {
    var url = `${this.baseUrl}getTeamByLocation`;

    var data1 = {
      location_id: res,
    };

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.dataSourceTeam = data["response"];
    });
  }

  get_team_id(res) {
    var url = `${this.baseUrl}getDataByTeam`;

    var data1 = {
      team_id: res,
    };

    this.ajaxService.post(data1, url).subscribe((data) => {
      this.dataSourceTeamDataAnalysis = data["response"];

      //console.log(this.dataSourceTeamDataAnalysis);

      this.dailyMiles = this.dataSourceTeamDataAnalysis[0][0].sum1;
      this.weeklyMiles = this.dataSourceTeamDataAnalysis[1][0].sum7;
      this.monthlyMiles = this.dataSourceTeamDataAnalysis[2][0].sum30;
    });
  }

  ngOnInit() {}
}
