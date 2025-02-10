import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
// import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import {
  DialogAddVendor,
  DialogEditVendor,
  DialogTagVendor,
  VendorComponent,
} from "./vendor.component";
import { GoogleMapsModule } from '@angular/google-maps';
// import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

export const routes = [
  { 
    path: '', 
    component: VendorComponent, 
    pathMatch: 'full' as 'full',
    data: {
      title: 'Vendor'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
    GoogleMapsModule,
    // NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  declarations: [
    VendorComponent,
    DialogAddVendor,
    DialogEditVendor,
    DialogTagVendor,
  ],

})
export class VendorModule {}
