import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StepsSupportComponent} from './steps-support.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const routes = [
  { path: '', component: StepsSupportComponent, pathMatch: 'full' }
];

@NgModule({
    declarations: [
      StepsSupportComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
    NgxDaterangepickerMd.forRoot(),
  ]
})
export class StepsSupportModule { }
