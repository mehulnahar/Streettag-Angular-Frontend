import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import {
  DialogAddVendor,
  DialogEditVendor,
  DialogTagVendor,
  VendorComponent,
} from "./vendor.component";
import { AgmCoreModule } from "@agm/core/core.module";

export const routes = [
  { path: "", component: VendorComponent, pathMatch: "full" },
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    })
  ],
  declarations: [
    VendorComponent,
    DialogAddVendor,
    DialogEditVendor,
    DialogTagVendor,
  ],
  entryComponents: [
    DialogAddVendor,
    DialogEditVendor,
    DialogTagVendor,
  ],
})
export class VendorModule {}
