import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserReportComponent } from './user-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';

export const routes = [
  { path: '', component: UserReportComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    UserReportComponent,
    // DialogCardqr,
    //DialogEditKingstone,
  ],
  entryComponents:[
    // DialogCardqr,
    //DialogEditKingstone,
  ]
})


export class UserReportModule { }
