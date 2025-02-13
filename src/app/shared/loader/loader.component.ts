import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="loading$ | async">
      <div class="loader-container">
        <img src="assets/img/logo.png" class="animated-logo">
        <h4>Loading...</h4>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loader-container {
      text-align: center;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .animated-logo {
      width: 80px;
      height: 80px;
      animation: spin 1s linear infinite;
    }
    h4 {
      margin-top: 10px;
      color: #333;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent implements OnInit {
  loading$ = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {}
} 