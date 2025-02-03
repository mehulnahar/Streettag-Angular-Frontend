import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
// import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import {
  FloorsComponent,
  DialogOverviewAddFloor,
  DialogOverviewFloor,
} from "./floors.component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const routes: Routes = [
  { path: "", component: FloorsComponent }
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  declarations: [
    FloorsComponent,
    DialogOverviewAddFloor,
    DialogOverviewFloor,
  ]
})
export class FloorsModule {}
