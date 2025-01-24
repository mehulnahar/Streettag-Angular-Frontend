import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfBoxAddDialog, RfBoxComponent, } from './rf-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

export const routes = [
  { path: '', component: RfBoxComponent, pathMatch: 'full' }
];

const COMPONENTS = [RfBoxComponent];
const COMPONENTS_DYNAMIC = [RfBoxAddDialog];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
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
    }),
  ],
  entryComponents:COMPONENTS_DYNAMIC
})
export class RfBoxModule { }
