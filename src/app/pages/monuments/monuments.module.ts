import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMonumentDialog, EditMonumentDialog, MonumentComponent } from './monument/monument.component';
import { AddTourDialog, DetailDialog, EditTourDialog, MonumentTourComponent } from './monument-tour/monument-tour.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core/core.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';

export const routes = [
  { path: '', redirectTo: 'details', pathMatch: 'full'},
  { path: 'details', component: MonumentComponent},
  { path: 'tour', component: MonumentTourComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    }),
    PipesModule
  ],
  declarations: [
    MonumentComponent,
    AddMonumentDialog,
    EditMonumentDialog,
    MonumentTourComponent,
    AddTourDialog,
    EditTourDialog,
    DetailDialog,
  ],
  entryComponents:[
    AddMonumentDialog,
    EditMonumentDialog,
    AddTourDialog,
    EditTourDialog,
    DetailDialog,
  ]
})
export class MonumentsModule { }
