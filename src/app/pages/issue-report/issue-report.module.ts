import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { IssueReportComponent } from './issue-report.component';

export const routes = [
  { path: '', component: IssueReportComponent, pathMatch: 'full' }
];

const COMPONENTS = [IssueReportComponent];
const COMPONENTS_DYNAMIC = [];

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
  declarations: [...COMPONENTS,...COMPONENTS_DYNAMIC],
  entryComponents:COMPONENTS_DYNAMIC
})
export class IssueReportModule { }
