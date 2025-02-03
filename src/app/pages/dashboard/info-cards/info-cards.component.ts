import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';

interface ChartData {
  name: string;
  value: number;
  series?: Array<{
    name: string;
    value: number;
  }>;
}

@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {
  public orders: ChartData[] = [];
  public products: ChartData[] = [];
  public customers: ChartData[] = [];
  public refunds: ChartData[] = [];
  public colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  };
  public autoScale = true;
  @ViewChild('resizedDiv', { static: true }) resizedDiv!: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  public settings: Settings;

  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
    this.initChartData();
  }

  ngOnInit(): void {
    this.initChartData();
    this.addRandomValue('orders');
    this.addRandomValue('customers');
  }

  public onSelect(event: ChartData): void {
    console.log('Item clicked', event);
  }

  private initChartData(): void {
    this.orders = [{
      name: 'Orders',
      value: 37,
      series: []
    }];
    this.products = [{
      name: 'Products',
      value: 45,
      series: []
    }];
    this.customers = [{
      name: 'Customers',
      value: 18,
      series: []
    }];
    this.refunds = [{
      name: 'Refunds',
      value: 12,
      series: []
    }];
  }

  public addRandomValue(param: string): void {
    switch (param) {
      case 'orders':
        if (this.orders[0].series) {
          for (let i = 1; i < 30; i++) {
            this.orders[0].series?.push({
              name: (1980 + i).toString(),
              value: Math.ceil(Math.random() * 1000000)
            });
          }
          this.orders = [...this.orders];
        }
        break;
      case 'customers':
        if (this.customers[0].series) {
          for (let i = 1; i < 15; i++) {
            this.customers[0].series?.push({
              name: (2000 + i).toString(),
              value: Math.ceil(Math.random() * 1000000)
            });
          }
          this.customers = [...this.customers];
        }
        break;
      case 'refunds':
        this.refunds = [...this.refunds];
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.orders[0].series) {
      this.orders[0].series.length = 0;
    }
    if (this.customers[0].series) {
      this.customers[0].series.length = 0;
    }
  }

  ngAfterViewChecked(): void {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      this.orders = [...this.orders];
      this.products = [...this.products];
      this.customers = [...this.customers];
      this.refunds = [...this.refunds];
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }
}