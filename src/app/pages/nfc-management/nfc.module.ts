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


export const routes = [
  { path: '', redirectTo: 'nfc', pathMatch: 'full'},
  { path: 'child-registration', component: NfcManagementComponent },
  { path: 'nfc-registration', component: NfcRegistrationComponent },
  { path: 'register', component: RegisterDialogComponent },
   
  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule
  ],
  declarations: [
    NfcManagementComponent,
    AddNfcDialog,
    NfcRegistrationComponent,
    RegisterDialogComponent,
    DebounceClickDirective,
  ],
 
  entryComponents:[
   AddNfcDialog,
   RegisterDialogComponent
  ]
})
export class nfcModule { }