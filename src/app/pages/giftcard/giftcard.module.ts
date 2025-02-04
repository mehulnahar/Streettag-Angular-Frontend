import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
// import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import { GiftcardComponent, create_gift_card } from "./giftcard.component";

export const routes: Routes = [
  { path: "", component: GiftcardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [GiftcardComponent, create_gift_card],
 
})
export class GiftcardModule {}
