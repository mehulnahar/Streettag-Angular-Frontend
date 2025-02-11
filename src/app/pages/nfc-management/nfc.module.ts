import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DebounceClickDirective } from 'src/app/theme/directives/debounce-click/debounce-click.directive';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { AddNfcDialog, NfcManagementComponent } from './nfc-management.component';
import { NfcRegistrationComponent } from './nfc-registration/nfc-registration.component';
import { RegisterDialogComponent } from './nfc-registration/register-dialog/register-dialog.component';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const routes = [
  { path: '', redirectTo: 'nfc', pathMatch: 'full' as const},
  { path: 'child-registration', component: NfcManagementComponent },
  { path: 'nfc-registration', component: NfcRegistrationComponent },
  { path: 'register', component: RegisterDialogComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  declarations: [
    NfcManagementComponent,
    AddNfcDialog,
    NfcRegistrationComponent,
    RegisterDialogComponent,
    DebounceClickDirective
  ]
})
export class nfcModule { }