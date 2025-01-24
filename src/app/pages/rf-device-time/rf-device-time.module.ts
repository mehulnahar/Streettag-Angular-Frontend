import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RfDeviceTimeComponent,
  RfDeviceTimeAddDialog,
  RfDeviceTimeViewDialog,
  RfDeviceTimeEditDialog,
} from './rf-device-time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: RfDeviceTimeComponent, pathMatch: 'full' },
];

const COMPONENTS = [RfDeviceTimeComponent];
const COMPONENTS_DYNAMIC = [
  RfDeviceTimeAddDialog,
  RfDeviceTimeViewDialog,
  RfDeviceTimeEditDialog,
];

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
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RfDeviceTimeModule {}

