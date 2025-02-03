import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { AjaxService } from "../../../ajax.service";

// Define interfaces for the response types
interface ScanTag {
  total_scaned_tags_in_day: number;
}

interface StepCount {
  total_steps: number;
}

interface Player {
  fullname: string;
}

interface Team {
  team_name: string;
}

interface PlayerCount {
  totalPlayers: number;
}

interface ProfileCount {
  players: number;
}

interface LocationCount {
  total_teams: number;
}

interface TeamCount {
  team: number;
}

interface DistanceCount {
  total_distance: number;
}

interface StreetTagCount {
  total_streettags: number;
}

// Define response interfaces
interface ApiResponse<T> {
  response: T[];
}

@Component({
  selector: "app-tiles",
  templateUrl: "./tiles.component.html",
  styleUrls: ["./tiles.component.scss"],
})
export class TilesComponent implements OnInit {
  public total_streettags: StreetTagCount[] = [];
  public total_streettags_count: number = 0;

  public total_distance: DistanceCount[] = [];
  public total_distance_count: number = 0;

  public total_teams: TeamCount[] = [];
  public total_teams_count: number = 0;

  public total_locations: LocationCount[] = [];
  public total_locations_count: number = 0;

  public total_profiles: ProfileCount[] = [];
  public total_profiles_count: number = 0;

  public total_last_hr_profiles: PlayerCount[] = [];
  public total_last_hr_profiles_count: number = 0;

  public get_top_team_arr: Team[] = [];
  public get_top_team_arr_val: string = '';

  public get_top_player_arr: Player[] = [];
  public get_top_player_arr_val: string = '';

  public total_scan_per_day_arr: ScanTag[] = [];
  public total_scan_per_day_val: number = 0;

  public total_steps_per_day_arr: StepCount[] = [];
  public total_steps_per_day_val: number = 0;

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

  ngOnInit() {}

  totalScansPerDay() {
    const url = `${environment.baseUrl}totalScansPerDay`;
    this.ajaxService.get<ApiResponse<ScanTag>>(url).subscribe(data => {
      this.total_scan_per_day_arr = data.response;
      this.total_scan_per_day_val = this.total_scan_per_day_arr[0].total_scaned_tags_in_day;
    });
  }

  totalStepsPerDay() {
    const url = `${environment.baseUrl}countLastDaySteps`;
    this.ajaxService.get<ApiResponse<StepCount>>(url).subscribe(data => {
      this.total_steps_per_day_arr = data.response;
      this.total_steps_per_day_val = this.total_steps_per_day_arr[0].total_steps;
    });
  }

  getTopPlayer() {
    const url = `${environment.baseUrl}getTopPlayer`;
    this.ajaxService.get<ApiResponse<Player>>(url).subscribe(data => {
      this.get_top_player_arr = data.response;
      this.get_top_player_arr_val = atob(this.get_top_player_arr[0].fullname);
    });
  }

  getTopTeam() {
    const url = `${environment.baseUrl}getTopTeam`;
    this.ajaxService.get<ApiResponse<Team>>(url).subscribe(data => {
      this.get_top_team_arr = data.response;
      this.get_top_team_arr_val = atob(this.get_top_team_arr[0].team_name);
    });
  }

  countLastHourPlayers() {
    const url = `${environment.baseUrl}countLastHourPlayers`;
    this.ajaxService.get<ApiResponse<PlayerCount>>(url).subscribe(data => {
      this.total_last_hr_profiles = data.response;
      this.total_last_hr_profiles_count = this.total_last_hr_profiles[0].totalPlayers;
    });
  }

  countTotalProfiles() {
    const url = `${environment.baseUrl}countTotalProfiles`;
    this.ajaxService.get<ApiResponse<ProfileCount>>(url).subscribe(data => {
      this.total_profiles = data.response;
      this.total_profiles_count = this.total_profiles[0].players;
    });
  }

  countTotalLocations() {
    const url = `${environment.baseUrl}countTotalLocations`;
    this.ajaxService.get<ApiResponse<LocationCount>>(url).subscribe(data => {
      this.total_locations = data.response;
      this.total_locations_count = this.total_locations[0].total_teams;
    });
  }

  countTotalTeams() {
    const url = `${environment.baseUrl}countTotalTeams`;
    this.ajaxService.get<ApiResponse<TeamCount>>(url).subscribe(data => {
      this.total_teams = data.response;
      this.total_teams_count = this.total_teams[0].team;
    });
  }

  totalDistance() {
    const url = `${environment.baseUrl}totalDistance`;
    this.ajaxService.get<ApiResponse<DistanceCount>>(url).subscribe(data => {
      this.total_distance = data.response;
      this.total_distance_count = this.total_distance[0].total_distance;
    });
  }

  countStreetTag() {
    const url = `${environment.baseUrl}countStreetTag`;
    this.ajaxService.get<ApiResponse<StreetTagCount>>(url).subscribe(data => {
      this.total_streettags = data.response;
      this.total_streettags_count = this.total_streettags[0].total_streettags;
    });
  }
}
