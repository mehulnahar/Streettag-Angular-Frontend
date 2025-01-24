import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DynamicleadComponent } from './dynamiclead.component';
import { PipesModule } from '../../theme/pipes/pipes.module';

export const routes = [
  { path: '', component: DynamicleadComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    PipesModule
  ],
  declarations: [
    DynamicleadComponent
  ]
})
export class DynamicleadModule { }