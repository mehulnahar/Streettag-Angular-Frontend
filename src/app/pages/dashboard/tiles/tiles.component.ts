import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { AjaxService } from "../../../ajax.service";

@Component({
  selector: "app-tiles",
  templateUrl: "./tiles.component.html",
  styleUrls: ["./tiles.component.scss"],
})
export class TilesComponent implements OnInit {
  public total_streettags = [];
  public total_streettags_count;

  public total_distance = [];
  public total_distance_count;

  public total_teams = [];
  public total_teams_count;

  public total_locations = [];
  public total_locations_count;

  public total_profiles = [];
  public total_profiles_count;

  public total_last_hr_profiles = [];
  public total_last_hr_profiles_count;

  public get_top_team_arr = [];
  public get_top_team_arr_val;

  public get_top_player_arr = [];
  public get_top_player_arr_val;

  public total_scan_per_day_arr = [];
  public total_scan_per_day_val;

  public total_steps_per_day_arr = [];
  public total_steps_per_day_val;
  private readonly baseUrl = environment.baseUrl;

  constructor(private ajaxService: AjaxService) {
    this.countStreetTag();
    this.totalDistance();
    this.countTotalTeams();
    this.countTotalLocations();
    this.countTotalProfiles();
    this.countLastHourPlayers();
    this.getTopTeam();
    this.getTopPlayer();
    this.totalScansPerDay();
    this.totalStepsPerDay();
  }

  totalScansPerDay() {
    const url = `${this.baseUrl}totalScansPerDay`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_scan_per_day_arr = data["response"];
      this.total_scan_per_day_val = this.total_scan_per_day_arr[0].total_scaned_tags_in_day;
    });
  }

  totalStepsPerDay() {
    const url = `${this.baseUrl}countLastDaySteps`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_steps_per_day_arr = data["response"];
      this.total_steps_per_day_val = this.total_steps_per_day_arr[0].total_steps;
    });
  }

  getTopPlayer() {
    const url = `${this.baseUrl}getTopPlayer`;
    this.ajaxService.get(url).subscribe((data) => {
      this.get_top_player_arr = data["response"];
      this.get_top_player_arr_val = atob(this.get_top_player_arr[0].fullname);
    });
  }

  getTopTeam() {
    const url = `${this.baseUrl}getTopTeam`;
    this.ajaxService.get(url).subscribe((data) => {
      this.get_top_team_arr = data["response"];
      this.get_top_team_arr_val = atob(this.get_top_team_arr[0].team_name);
    });
  }

  countLastHourPlayers() {
    const url = `${this.baseUrl}countLastHourPlayers`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_last_hr_profiles = data["response"];
      this.total_last_hr_profiles_count = this.total_last_hr_profiles[0].totalPlayers;
    });
  }

  countTotalProfiles() {
    const url = `${this.baseUrl}countTotalProfiles`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_profiles = data["response"];
      this.total_profiles_count = this.total_profiles[0].players;
    });
  }

  countTotalLocations() {
    const url = `${this.baseUrl}countTotalLocations`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_locations = data["response"];
      this.total_locations_count = this.total_locations[0].total_teams;
    });
  }

  countTotalTeams() {
    const url = `${this.baseUrl}countTotalTeams`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_teams = data["response"];
      this.total_teams_count = this.total_teams[0].team;
    });
  }

  totalDistance() {
    const url = `${this.baseUrl}totalDistance`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_distance = data["response"];
      this.total_distance_count = this.total_distance[0].total_distance;
    });
  }

  countStreetTag() {
    const url = `${this.baseUrl}countStreetTag`;
    this.ajaxService.get(url).subscribe((data) => {
      this.total_streettags = data["response"];
      this.total_streettags_count = this.total_streettags[0].total_streettags;
    });
  }

  ngOnInit() {}
}
