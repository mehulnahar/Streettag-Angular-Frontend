import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogAddSchool, DialogBulkSchool, DialogEditSchool, SchoolComponent } from "./school.component";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";

export const routes = [
  { path: "", component: SchoolComponent, pathMatch: "full" },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    MatTableModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    SchoolComponent,
    DialogAddSchool,
    DialogEditSchool,
    DialogBulkSchool
  ],
  entryComponents:[
    DialogAddSchool,
    DialogEditSchool,
    DialogBulkSchool
  ]
})
export class SchoolModule {}
