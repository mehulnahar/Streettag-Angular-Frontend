import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(public router: Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
    // Initialize miles statistics
    this.loadMilesStatistics();
  }

  private loadMilesStatistics() {
    // TODO: Replace with actual API calls to get the statistics
    // For now using mock data
    this.dailyTotalMiles = 0;
    this.weeklyTotalMiles = 0;
    this.monthlyTotalMiles = 0;
  }
}
