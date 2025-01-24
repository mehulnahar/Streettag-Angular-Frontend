import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  DialogEditPolytags, DialogOverviewAddMessageDialogPolytags, PolytagsComponent } from './polytags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { AgmCoreModule } from '@agm/core';


export const routes = [
  { path: '', component: PolytagsComponent, pathMatch: 'full' }
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    })
  ],
  declarations: [
    PolytagsComponent,
    DialogOverviewAddMessageDialogPolytags,
    DialogEditPolytags,
  ],
  entryComponents:[
    DialogOverviewAddMessageDialogPolytags,
    DialogEditPolytags,
  ]
})
export class PolytagsModule { }
