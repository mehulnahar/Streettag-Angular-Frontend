import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfidAddDialog, RfidViewDialog, RfRegistrationComponent } from './rf-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: RfRegistrationComponent, pathMatch: 'full' }
];

const COMPONENTS = [RfRegistrationComponent];
const COMPONENTS_DYNAMIC = [RfidAddDialog,RfidViewDialog];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  entryComponents:COMPONENTS_DYNAMIC
})
export class RfRegistrationModule { }
