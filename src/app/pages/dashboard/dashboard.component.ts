import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AjaxService } from '../../ajax.service';
import { environment } from '../../../environments/environment';

interface Location {
  id: number;
  location_name: string;
}

interface Team {
  id: number;
  team_name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Miles statistics
  dailyTotalMiles: number = 0;
  weeklyTotalMiles: number = 0;
  monthlyTotalMiles: number = 0;

  // Location and Team data
  locations: Location[] = [];
  teams: Team[] = [];
  selectedLocation: number | null = null;
  selectedTeam: number | null = null;
  private readonly baseUrl = environment.baseUrl;

  constructor(
    public router: Router, 
    public snackBar: MatSnackBar,
    private ajaxService: AjaxService
  ) { }

  ngOnInit() {
    this.loadMilesStatistics();
    this.getLocations();
  }

  // Function to decode base64 team names
  atob(str: string): string {
    try {
      return window.atob(str);
    } catch (e) {
      return str; // Return original string if decoding fails
    }
  }

  private loadMilesStatistics() {
    // TODO: Replace with actual API calls to get the statistics
    // For now using mock data
    this.dailyTotalMiles = 0;
    this.weeklyTotalMiles = 0;
    this.monthlyTotalMiles = 0;
  }

  private getLocations() {
    const url = `${this.baseUrl}getLocations`;
    this.ajaxService.get(url).subscribe({
      next: (data: any) => {
        if (data.status === 'true') {
          this.locations = data.response;
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading locations', 'Close', { duration: 3000 });
      }
    });
  }

  onLocationChange(locationId: number) {
    if (locationId) {
      const url = `${this.baseUrl}getTeamByLocation`;
      const data = {
        location_id: locationId
      };
      
      this.ajaxService.post(data, url).subscribe({
        next: (response: any) => {
          if (response.status === 'true') {
            this.teams = response.response;
            this.selectedTeam = null; // Reset team selection
          }
        },
        error: (error) => {
          this.snackBar.open('Error loading teams', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onTeamChange(teamId: number) {
    if (teamId) {
      // Handle team selection - you can add any additional functionality here
      console.log('Selected team:', teamId);
    }
  }
}
