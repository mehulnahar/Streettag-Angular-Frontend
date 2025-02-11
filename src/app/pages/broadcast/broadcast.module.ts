import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { Acceptancedialog, BroadcastComponent, DialogAddBroadcast, DialogAddBroadcastLocation, DialogBroadcastList } from './broadcast.component';
import { BroadcastCategoryComponent, AddCategoryDialogComponent, EditCategoryDialogComponent, DeleteConfirmationDialogComponent } from './broadcast-category.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const routes = [
  { path: '', component: BroadcastComponent, pathMatch: 'full' as const },
  { path: 'broadcast-category', component: BroadcastCategoryComponent, data: { breadcrumb: 'Broadcast Category' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
    GoogleMapsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [
    BroadcastComponent,
    BroadcastCategoryComponent,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent,
    DeleteConfirmationDialogComponent,
    Acceptancedialog,
    DialogAddBroadcast,
    DialogAddBroadcastLocation,
    DialogBroadcastList
  ]
})
export class BroadcastModule { }
