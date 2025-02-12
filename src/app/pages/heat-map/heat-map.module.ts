import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HeatMapComponent } from './heat-map.component';

export const routes: Routes = [
  { path: '', component: HeatMapComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    SimplebarAngularModule,
    SharedModule,
    PipesModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HeatMapComponent
  ]
})
export class HeatMapingModule { }