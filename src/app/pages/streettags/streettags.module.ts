import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {DialogOverviewAddMessageDialogStreettags, DialogOverviewMessageDialogStreettags, StreettagsComponent } from './streettags.component';

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
  ],
  declarations: [
    StreettagsComponent,
    DialogOverviewAddMessageDialogStreettags,
    DialogOverviewMessageDialogStreettags,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StreettagsModule { }
