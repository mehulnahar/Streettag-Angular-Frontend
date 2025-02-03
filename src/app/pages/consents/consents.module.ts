import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ConsentsComponent } from './consents.component';

export const routes: Routes = [
  { path: '', component: ConsentsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ConsentsComponent]
})
export class ConsentsModule { }
