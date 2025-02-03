import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { DiskSpaceComponent } from './disk-space/disk-space.component';
import { TodoComponent } from './todo/todo.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { TilesComponent } from './tiles/tiles.component';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

export const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent, 
    pathMatch: 'full' as const
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxChartsModule,
    SharedModule,
    PipesModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    InfoCardsComponent,
    DiskSpaceComponent,
    TodoComponent,
    AnalyticsComponent,
    TilesComponent
  ]
})
export class DashboardModule { }
