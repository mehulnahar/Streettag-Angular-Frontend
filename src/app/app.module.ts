import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayContainer } from "@angular/cdk/overlay";
import { CustomOverlayContainer } from "./theme/utils/custom-overlay-container";
import { AjaxService } from "./ajax.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatTableModule } from "@angular/material/table";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { Select2Module } from "ng2-select2";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
//var fs = require('file-syastem');

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true,
};
import { SearchitComponent } from "./pages/searchit/searchit.component";
import { TransactionComponent } from "./pages/transaction/transaction.component";

import { CalendarModule } from "angular-calendar";
import { SharedModule } from "./shared/shared.module";
import { PipesModule } from "./theme/pipes/pipes.module";
import { routing } from "./app.routing";

import { AppSettings } from "./app.settings";
import { AppComponent } from "./app.component";
import { PagesComponent } from "./pages/pages.component";

import { BlankComponent } from "./pages/blank/blank.component";
import { SearchComponent } from "./pages/search/search.component";
import { ErrorComponent } from "./pages/errors/error/error.component";

import { TopInfoContentComponent } from "./theme/components/top-info-content/top-info-content.component";
import { SidenavComponent } from "./theme/components/sidenav/sidenav.component";
import { VerticalMenuComponent } from "./theme/components/menu/vertical-menu/vertical-menu.component";
import { HorizontalMenuComponent } from "./theme/components/menu/horizontal-menu/horizontal-menu.component";
import { FlagsMenuComponent } from "./theme/components/flags-menu/flags-menu.component";
import { FullScreenComponent } from "./theme/components/fullscreen/fullscreen.component";
import { ApplicationsComponent } from "./theme/components/applications/applications.component";
import { MessagesComponent } from "./theme/components/messages/messages.component";
import { UserMenuComponent } from "./theme/components/user-menu/user-menu.component";
import { FavoritesComponent } from "./theme/components/favorites/favorites.component";

import {
  DatePipe,
  DecimalPipe,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { MycompComponent } from "./test/mycomp/mycomp.component";

import { ConsentsComponent } from "./pages/consents/consents.component";
import { DecodePipePipe } from "./decode-pipe.pipe";
import { LeaderboardComponent } from "./pages/leaderboard/leaderboard.component";
import { DynamicLeaderboardComponent } from "./pages/dynamicleadeboard/leaderboard.component";
import { GiveBonusPointsComponent } from "./pages/give-bonus-points/give-bonus-points.component";

import { EventsQRComponent } from "./pages/events-qr/events-qr.component";

import {
  CancelgiftComponent,
  DeletedialogLocationgift,
} from "./pages/cancelgift/cancelgift.component";

import {
  AssetcategoryComponent,
  DeleteAssetCategory,
  DialogEditAssetCategory,
  DialogOverviewAddMessageDialogLocationCategory,
} from "./pages/asset-category/assetcategory.component";

import {
  WithdrawApprovalComponent,
  DialogElementsApprovalDialog,
} from "./pages/withdraw-approval/withdraw-approval.component";
import { PecodeComponent } from "./pages/pecode/pecode.component";

import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { TokenInterceptor } from "./services/auth/token.interceptor";
import { AgmMarkerClustererModule } from "@agm/markerclusterer";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import {
  DialogOverviewCouponDialog,
  ToggleimagesComponent,
} from "./pages/toggleimages/toggleimages.component";
import { PdfComponent } from "./pages/pdf/pdf.component";
import { LinkComponent } from "./pages/linkweb/link.component";
import { ExcelService } from "./excel.service";
import { AccessDeniedComponent } from "./pages/errors/access-denied/access-denied.component";
import { LoginComponent } from "./pages/login/login.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { DeleteDialog } from "./deletedialog/deletedialog.component";
import { HoverColorChangeDirective } from './theme/directives/hover-color-change.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PtestComponent } from './pages/ptest/ptest.component';
import { DobChangeComponent } from './pages/dob-change/dob-change.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0",
    }),
    PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    routing,
    NgxMaterialTimepickerModule,
    MatTableModule,
    NgxMatSelectSearchModule,
    Select2Module,
    AgmMarkerClustererModule,
    NgxChartsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    LoginComponent,
    AccessDeniedComponent,
    AppComponent,
    PagesComponent,
    BlankComponent,
    SearchComponent,
    ErrorComponent,
    TopInfoContentComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FavoritesComponent,
    SearchitComponent,
    TransactionComponent,
    DeleteDialog,
    DialogOverviewAddMessageDialogLocationCategory,

    MycompComponent,

    DecodePipePipe,

    LeaderboardComponent,
    GiveBonusPointsComponent,
    EventsQRComponent,

    CancelgiftComponent,
    DeletedialogLocationgift,

    AssetcategoryComponent,
    DialogEditAssetCategory,
    DeleteAssetCategory,

    WithdrawApprovalComponent,
    DialogElementsApprovalDialog,

    ToggleimagesComponent,
    DialogOverviewCouponDialog,
    PdfComponent,
    LinkComponent,
    DynamicLeaderboardComponent,
    HoverColorChangeDirective,
    PtestComponent,
    DobChangeComponent
  ],
  providers: [
    DatePipe,
    AjaxService,
    AppSettings,
    DecimalPipe,
    ExcelService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  entryComponents: [
    LoginComponent,
    AccessDeniedComponent,
    DeleteDialog,
    DialogOverviewAddMessageDialogLocationCategory,
    DeletedialogLocationgift,
    DialogEditAssetCategory,
    DeleteAssetCategory,
    DialogElementsApprovalDialog,
  ],bootstrap: [AppComponent]
})
export class AppModule {}
