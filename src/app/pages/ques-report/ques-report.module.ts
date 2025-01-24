import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QuesReportComponent } from './ques-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


export const routes = [
  { path: '', component: QuesReportComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),  
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    NgxDaterangepickerMd.forRoot(),
    MatTableModule,
    ],
  declarations: [
    QuesReportComponent
  ]
})
export class QuesReportModule { }




