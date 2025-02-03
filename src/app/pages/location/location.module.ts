import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { PipesModule } from '@app/theme/pipes/pipes.module';
import { LocationComponent, DialogOverviewAddMessageDialogLocation, DialogOverviewMessageDialogLocation, DeletedialogLocation } from './location.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

export const routes: Routes = [
  { 
    path: '', 
    component: LocationComponent,
    data: { 
      title: 'Location Management',
      breadcrumb: 'Location Management'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    PipesModule,
    // Material Modules
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule
  ],
  declarations: [
    LocationComponent,
    DialogOverviewAddMessageDialogLocation,
    DialogOverviewMessageDialogLocation,
    DeletedialogLocation
  ]
})
export class LocationModule { }
