import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfCircuitAddDialog, RfCircuitComponent } from './rf-circuit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: RfCircuitComponent, pathMatch: 'full' }
];

const COMPONENTS = [RfCircuitComponent];
const COMPONENTS_DYNAMIC = [RfCircuitAddDialog];

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
  ],
  entryComponents:COMPONENTS_DYNAMIC
})
export class RfCircuitModule { }
