import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { OpportunitiesComponent, DialogOverviewAddMessageDialogOpportunities, DialogOverviewMessageDialogOpportunities } from './opportunities.component';

export const routes = [
  { path: '', component: OpportunitiesComponent, pathMatch: 'full' }
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
    OpportunitiesComponent,
    DialogOverviewAddMessageDialogOpportunities,
    DialogOverviewMessageDialogOpportunities,
  ],
  entryComponents:[
    DialogOverviewAddMessageDialogOpportunities,
    DialogOverviewMessageDialogOpportunities,
    ]
})
export class OpportuntitesModule { }
