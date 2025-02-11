import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from '../../shared/shared.module';
import { TextFieldModule } from '@angular/cdk/text-field';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { MonumentComponent, AddMonumentDialog, EditMonumentDialog } from './monument/monument.component';
import { MonumentTourComponent, AddTourDialog, EditTourDialog, DetailDialog } from './monument-tour/monument-tour.component';

export const routes: Routes = [
  { path: '', redirectTo: 'details', pathMatch: 'full' },
  { 
    path: 'details', 
    component: MonumentComponent,
    data: { breadcrumb: 'Monument Management' }
  },
  { 
    path: 'tour', 
    component: MonumentTourComponent,
    data: { breadcrumb: 'Monument Tour' }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    SharedModule,
    TextFieldModule,
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [
    MonumentComponent,
    AddMonumentDialog,
    EditMonumentDialog,
    MonumentTourComponent,
    AddTourDialog,
    EditTourDialog,
    DetailDialog
  ]
})
export class MonumentsModule { }
