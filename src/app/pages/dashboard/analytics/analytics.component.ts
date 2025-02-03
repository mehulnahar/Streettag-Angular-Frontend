import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public analytics: ChartData[] = [];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Year';
  public showYAxisLabel = false;
  public yAxisLabel = 'Population';
  public autoScale = true;
  public roundDomains = true;
  public colorScheme: any = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  };
  @ViewChild('resizedDiv', { static: true }) resizedDiv!: ElementRef;
  public previousWidthOfResizedDiv:number = 0; 

  constructor() {
    this.analytics = [
      {
        name: 'Jan',
        value: 20
      },
      {
        name: 'Feb',
        value: 35
      },
      {
        name: 'Mar',
        value: 25
      }
    ];
  }

  onSelect(event: ChartData): void {
    console.log('Item clicked', event);
  }

  ngOnInit(): void {}

  ngAfterViewChecked() {    
    if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
      this.analytics = [...this.analytics];
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }
}