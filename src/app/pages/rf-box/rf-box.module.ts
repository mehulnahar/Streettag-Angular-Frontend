import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfBoxAddDialog, RfBoxComponent } from './rf-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export const routes = [
  { path: '', component: RfBoxComponent, pathMatch: 'full' as const }
];

@NgModule({
  declarations: [RfBoxComponent, RfBoxAddDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,     
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
    GoogleMapsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class RfBoxModule { }
