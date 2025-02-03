import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogOverviewAddMessageDialogStreettags, DialogOverviewMessageDialogStreettags, StreettagsComponent } from './streettags.component';

export const routes: Routes = [
  { path: '', component: StreettagsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    SharedModule,
    PipesModule,
    LeafletModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [
    StreettagsComponent,
    DialogOverviewAddMessageDialogStreettags,
    DialogOverviewMessageDialogStreettags,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StreettagsModule { }
