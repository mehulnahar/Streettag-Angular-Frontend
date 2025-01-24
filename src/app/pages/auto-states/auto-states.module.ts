import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from '../form-controls/autocomplete/autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { AutoStatesComponent } from './auto-states.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

export const routes = [
  { path: '', component: AutoStatesComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    MatTableModule,
    RouterModule.forChild(routes),
  ],
  declarations:[
    AutoStatesComponent,
    AddDialogComponent,
    EditDialogComponent,
  ],
  entryComponents:[
    AddDialogComponent,
    EditDialogComponent,
  ]
})
export class AutoStatesModule { }
