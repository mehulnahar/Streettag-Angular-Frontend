import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import {
  FloorsComponent,
  DialogOverviewAddFloor,
  DialogOverviewFloor,
  
} from "./floors.component";

export const routes = [
  { path: "", component: FloorsComponent, pathMatch: "full" },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    FloorsComponent,
    DialogOverviewAddFloor,
    DialogOverviewFloor,
  ],
  entryComponents: [
    DialogOverviewAddFloor,
    DialogOverviewFloor,
  ],
})
export class FloorsModule {}
