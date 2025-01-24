import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";

import { PagesComponent } from "./pages/pages.component";
import { SearchitComponent } from "./pages/searchit/searchit.component";
import { NotFoundComponent } from "./pages/errors/not-found/not-found.component";
import { ErrorComponent } from "./pages/errors/error/error.component";
import { ConsentsComponent } from "./pages/consents/consents.component";
import { LeaderboardComponent } from "./pages/leaderboard/leaderboard.component";
// import { DynamicleadeboardComponent } from './pages/dynamicleadeboard/dynamicleadeboard.component';
import { GiveBonusPointsComponent } from "./pages/give-bonus-points/give-bonus-points.component";
import { CancelgiftComponent } from "./pages/cancelgift/cancelgift.component";
import { WithdrawApprovalComponent } from "./pages/withdraw-approval/withdraw-approval.component";
import { PecodeComponent } from "./pages/pecode/pecode.component";

import { DobChangeComponent } from './pages/dob-change/dob-change.component';

import { AuthGuardService as AuthGuard } from "./services/auth/auth-guard.service";

import { AccessDeniedComponent } from "./pages/errors/access-denied/access-denied.component";
import { LoginComponent } from "./pages/login/login.component";
import { QuesReportModule } from "./pages/ques-report/ques-report.module";

export const routes: Routes = [
   { path: "", redirectTo: "access-denined", pathMatch: "full" },
  { path: "login", redirectTo: "login", pathMatch: "full" },
  /*{ 
        path: 'admin', 
        component: PagesComponent, children: [

            // { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' } ,  canActivate: [AuthGuard] },
            //{ path: 'users', loadChildren: './pages/users/users.module#UsersModule', data: { breadcrumb: 'Users' } },
            // { path: 'dynamic-menu', loadChildren: './pages/dynamic-menu/dynamic-menu.module#DynamicMenuModule', data: { breadcrumb: 'Dynamic Menu' }  },          
           // { path: 'ui', loadChildren: './pages/ui/ui.module#UiModule', data: { breadcrumb: 'UI' } },
           // { path: 'mailbox', loadChildren: './pages/mailbox/mailbox.module#MailboxModule', data: { breadcrumb: 'Mailbox' } },
           // { path: 'chat', loadChildren: './pages/chat/chat.module#ChatModule', data: { breadcrumb: 'Chat' } },
           // { path: 'form-controls', loadChildren: './pages/form-controls/form-controls.module#FormControlsModule', data: { breadcrumb: 'Form Controls' } },
            //{ path: 'tables', loadChildren: './pages/tables/tables.module#TablesModule', data: { breadcrumb: 'Tables' } },
            //{ path: 'schedule', loadChildren: './pages/schedule/schedule.module#ScheduleModule', data: { breadcrumb: 'Schedule' } },
            //{ path: 'maps', loadChildren: './pages/maps/maps.module#MapsModule', data: { breadcrumb: 'Maps' } },
            //{ path: 'charts', loadChildren: './pages/charts/charts.module#ChartsModule', data: { breadcrumb: 'Charts' } },
            //{ path: 'drag-drop', loadChildren: './pages/drag-drop/drag-drop.module#DragDropModule', data: { breadcrumb: 'Drag & Drop' } },
            //{ path: 'icons', loadChildren: './pages/icons/icons.module#IconsModule', data: { breadcrumb: 'Material Icons' } },
            // { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } },
            // { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } },
            // { path: 'search/:name', component: SearchComponent, data: { breadcrumb: 'Search' } }
        ]
    },*/
  {
    path: "admin",
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        data: { breadcrumb: "Dashboard" },
        canActivate: [AuthGuard],
      },
      //{ path: 'user_mng', component: UserComponent, canActivate: [AuthGuard]},
      {
        path: "location",
        loadChildren: () =>
          import("./pages/location/location.module").then(
            (m) => m.LocationModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "circuit",
        loadChildren: () =>
          import("./pages/circuit/circuit.module").then((m) => m.CircuitModule),
        canActivate: [AuthGuard],
      },
      {
        path: "streettags",
        loadChildren: () =>
          import("./pages/streettags/streettags.module").then(
            (m) => m.StreettagsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "opportunities",
        loadChildren: () =>
          import("./pages/opportunities/opportuntites.module").then(
            (m) => m.OpportuntitesModule
          ),
        canActivate: [AuthGuard],
      },
      //  { path: 'event_mng', component: EventComponent, canActivate: [AuthGuard] },
      {
        path: "search_mng",
        component: SearchitComponent,
        canActivate: [AuthGuard],
      },
      // { path: 'transaction_mng', component: TransactionComponent, canActivate: [AuthGuard] },
      // { path: 'userinfo', component: Forminfo, canActivate: [AuthGuard] },
      {
        path: "builiding",
        loadChildren: () =>
          import("./pages/building/building.module").then(
            (m) => m.BuildingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "floors",
        loadChildren: () =>
          import("./pages/floors/floors.module").then((m) => m.FloorsModule),
        canActivate: [AuthGuard],
      },
      {
        path: "vendor",
        loadChildren: () =>
          import("./pages/vendor/vendor.module").then((m) => m.VendorModule),
        canActivate: [AuthGuard],
      },

      {
        path: "consents",
        loadChildren: () =>
          import("./pages/consents/consents.module").then(
            (m) => m.ConsentsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "sponsor",
        loadChildren: () =>
          import("./pages/sponsor/sponsor.module").then((m) => m.SponsorModule),
        canActivate: [AuthGuard],
      },
      {
        path: "leaderboard",
        component: LeaderboardComponent,
        canActivate: [AuthGuard],
      },
      //{ path: 'dynamicleaderboard', component: DynamicleadeboardComponent, canActivate: [AuthGuard]},
      {
        path: "giveBonusPoints",
        component: GiveBonusPointsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "school",
        loadChildren: () =>
          import("./pages/school/school.module").then((m) => m.SchoolModule),
        canActivate: [AuthGuard],
      },
      //{ path: 'eventsqr', component: EventsQRComponent, canActivate: [AuthGuard]},
      {
        path: "giftcard",
        loadChildren: () =>
          import("./pages/giftcard/giftcard.module").then(
            (m) => m.GiftcardModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "canclegift",
        component: CancelgiftComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "sendgift",
        loadChildren: () =>
          import("./pages/sendgift/send-gift.module").then(
            (m) => m.SendGiftModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "questionnaires",
        loadChildren: () =>
          import("./pages/questionnaires/questionnaires.module").then(
            (m) => m.QuestionnairesModule
          ),
        canActivate: [AuthGuard],
      },

      // { path: 'assetCategory', component: AssetcategoryComponent, canActivate: [AuthGuard]},
      //  { path: 'asset', loadChildren: './pages/asset/asset.module#AssetModule', canActivate: [AuthGuard]},
      {
        path: "schoolQr",
        loadChildren: () =>
          import("./pages/kingstone/kingstone.module").then(
            (m) => m.KingstoneModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "cardqr",
        loadChildren: () =>
          import("./pages/cardqr/cardqr.module").then(
            (m) => m.CardqrModule
          ),
        canActivate: [AuthGuard],
      },     
      {
        path: "user-delete",
        loadChildren: () =>
          import("./pages/user-delete/user-delete.module").then(
            (m) => m.UserDeleteModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "user-report",
        loadChildren: () =>
          import("./pages/user-report/user-report.module").then(
            (m) => m.UserReportModule
          ),
        canActivate: [AuthGuard],
      },           
      {
        path: "demo",
        loadChildren: () =>
          import("./pages/demo/demo.module").then(
            (m) => m.DemoModule
          ),
        canActivate: [AuthGuard],
      },         
      {
        path: "polytags",
        loadChildren: () =>
          import("./pages/polytags/polytags.module").then(
            (m) => m.PolytagsModule
          ),
        canActivate: [AuthGuard],
      },

      {
        path: "withdraw-approval",
        component: WithdrawApprovalComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "trainer",
        loadChildren: () =>
          import("./pages/trainer/trainer.module").then((m) => m.TrainerModule),
        canActivate: [AuthGuard],
      },
      {
        path: "pecode",
        loadChildren: () =>
          import("./pages/pecode/pecode.module").then((m) => m.PecodeModule),
        canActivate: [AuthGuard],
      },
      {
        path: "charity",
        loadChildren: () =>
          import("./pages/charity/charity.module").then((m) => m.CharityModule),
        canActivate: [AuthGuard],
      },
      {
        path: "monument",
        loadChildren: () =>
          import("./pages/monuments/monuments.module").then(
            (m) => m.MonumentsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "nfc",
        loadChildren: () =>
          import("./pages/nfc-management/nfc.module").then((m) => m.nfcModule),
        canActivate: [AuthGuard],
      },
      {
        path: "dob-change",
        component: DobChangeComponent,
        canActivate: [AuthGuard],
      },    
      {
        path: "steps-support",
        loadChildren: () =>
          import("./pages/support/steps-support/steps-support.module").then((m) => m.StepsSupportModule),
        canActivate: [AuthGuard],
      },
      {
        path: "issue-report",
        loadChildren: () =>
          import("./pages/issue-report/issue-report.module").then((m) => m.IssueReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: "active-team",
        loadChildren: () =>
          import("./pages/active-team/active-team.module").then((m) => m.ActiveTeamModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "report",
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "monitoring-report",
        loadChildren: () =>
          import("./pages/monitoring/monitoring.module").then(
            (m) => m.MonitoringModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "heat-map",
        loadChildren: () =>
          import("./pages/heat-map/heat-map.module").then(
            (m) => m.HeatMapingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./pages/chart-report/chart-report.module").then(
            (m) => m.ChartReportModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "ques-genrator",
        loadChildren: () =>
          import("./pages/ques-report/ques-report.module").then(
            (m) => m.QuesReportModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "auto-states",
        loadChildren: () =>
          import("./pages/auto-states/auto-states.module").then(
            (m) => m.AutoStatesModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "rfid",
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "rf-registration",
        loadChildren: () =>
          import("./pages/rf-registration/rf-registration.module").then(
            (m) => m.RfRegistrationModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "rf-circuit",
        loadChildren: () =>
          import("./pages/rf-circuit/rf-circuit.module").then(
            (m) => m.RfCircuitModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "rf-device-time",
        loadChildren: () =>
          import("./pages/rf-device-time/rf-device-time.module").then(
            (m) => m.RfDeviceTimeModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "rf-box",
        loadChildren: () =>
          import("./pages/rf-box/rf-box.module").then(
            (m) => m.RfBoxModule
          ),
        canActivate: [AuthGuard],
      }
    ],
  },
  {
    path: "broadcast",
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "list",
        loadChildren: () =>
          import("./pages/broadcast/broadcast.module").then(
            (m) => m.BroadcastModule
          ),
        data: { breadcrumb: "list" },
        canActivate: [AuthGuard],
      },
      {
        path: "broadcast-category",
        data: { breadcrumb: "broadcast-category" },
        loadChildren: () =>
          import("./pages/broadcast-category/broadcast-category.module").then(
            (m) => m.BroadcastCategoryModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },

 


  { path: "login", component: LoginComponent },
  {
    path: "access-denined",
    component: AccessDeniedComponent,
  },
  // { path: 'register', loadChildren: './pages/register/register.module#RegisterModule' },
  {
    path: "dynamiclead",
    loadChildren: () =>
      import("./pages/dynamiclead/dynamiclead.module").then(
        (m) => m.DynamicleadModule
      ),
  },
  { path: "error", component: ErrorComponent, data: { breadcrumb: "Error" } },
  {
    path: "**",
    loadChildren: () =>
      import("./pages/errors/not-found/not-found.module").then(
        (m) => m.NotFoundModule
      ),
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
  // useHash: true
});
