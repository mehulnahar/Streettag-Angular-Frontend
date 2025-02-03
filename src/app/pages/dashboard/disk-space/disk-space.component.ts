import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../../ajax.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface LocationData {
  id: number;
  location_name: string;
}

interface TeamData {
  id: number;
  team_name: string;
}

interface TeamAnalysis {
  sum1?: number;
  sum7?: number;
  sum30?: number;
}

@Component({
  selector: 'app-disk-space',
  templateUrl: './disk-space.component.html',
  styleUrls: ['./disk-space.component.scss']
})
export class DiskSpaceComponent implements OnInit {
  public dataSourceLocation: LocationData[] = [];
  public dataSourceTeam: TeamData[] = [];
  public dataSourceTeamDataAnalysis: TeamAnalysis[][] = [];
  public dailyMiles: number = 0;
  public weeklyMiles: number = 0;
  public monthlyMiles: number = 0;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    private ajaxService: AjaxService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.getallLocation();
  }

  getallLocation(): void {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).subscribe((data: any) => {
      this.dataSourceLocation = data['response'];
    });
  }

  get_location_id(res: number): void {
    const url = `${this.baseUrl}getTeamByLocation`;
    const data1 = {
      location_id: res,
    };
    this.ajaxService.post(data1, url).subscribe((data: any) => {
      this.dataSourceTeam = data['response'];
    });
  }

  get_team_id(res: number): void {
    const url = `${this.baseUrl}getDataByTeam`;
    const data1 = {
      team_id: res,
    };
    this.ajaxService.post(data1, url).subscribe((data: any) => {
      this.dataSourceTeamDataAnalysis = data['response'];
      if (this.dataSourceTeamDataAnalysis[0]?.[0]?.sum1) {
        this.dailyMiles = this.dataSourceTeamDataAnalysis[0][0].sum1;
      }
      if (this.dataSourceTeamDataAnalysis[1]?.[0]?.sum7) {
        this.weeklyMiles = this.dataSourceTeamDataAnalysis[1][0].sum7;
      }
      if (this.dataSourceTeamDataAnalysis[2]?.[0]?.sum30) {
        this.monthlyMiles = this.dataSourceTeamDataAnalysis[2][0].sum30;
      }
    });
  }

  ngOnInit(): void {}
}
