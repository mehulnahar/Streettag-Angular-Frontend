import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { CircuitComponent, DeletedialogCircuit, DialogOverviewAddMessageDialogCircuit, DialogOverviewMessageDialogCircuit } from './circuit.component';

export const routes = [
  { path: '', component: CircuitComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes)
   ],
  declarations: [
    CircuitComponent,
    DialogOverviewAddMessageDialogCircuit,
    DialogOverviewMessageDialogCircuit,
    DeletedialogCircuit
  ],
  entryComponents:[
    DialogOverviewAddMessageDialogCircuit,
    DialogOverviewMessageDialogCircuit,
    DeletedialogCircuit
  ]
})
export class CircuitModule { }
