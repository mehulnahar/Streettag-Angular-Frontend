import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import { GiftcardComponent, create_gift_card } from "./giftcard.component";

export const routes = [
  { path: "", component: GiftcardComponent, pathMatch: "full" },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [GiftcardComponent, create_gift_card],
  entryComponents: [create_gift_card],
})
export class GiftcardModule {}
