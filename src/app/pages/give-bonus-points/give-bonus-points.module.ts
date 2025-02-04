import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GiveBonusPointsComponent } from './give-bonus-points.component';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const routes: Routes = [
  { path: '', component: GiveBonusPointsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  declarations: [
    GiveBonusPointsComponent
  ]
})
export class GiveBonusPointsModule { } 