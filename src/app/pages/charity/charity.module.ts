import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { CharityComponent, DialogBoxAddCharity, EditCharityPopUp } from './charity.component';

export const routes = [
  { path: '', component: CharityComponent, pathMatch: 'full' }
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
    CharityComponent,
    DialogBoxAddCharity,
    EditCharityPopUp
  ],
  entryComponents:[
    DialogBoxAddCharity,
    EditCharityPopUp
  ]
})
export class CharityModule { }
