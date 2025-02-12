import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RfDeviceTimeComponent,
  RfDeviceTimeAddDialog,
  RfDeviceTimeViewDialog,
  RfDeviceTimeEditDialog,
} from './rf-device-time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

export const routes = [
  { path: '', component: RfDeviceTimeComponent, pathMatch: 'full' as const },
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
    // PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RfDeviceTimeModule {}

