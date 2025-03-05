import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'rf-device-time',
        loadChildren: () => import('./pages/rf-device-time/rf-device-time.module').then(m => m.RfDeviceTimeModule),
        data: { breadcrumb: 'RF Device Time' }
      },
      {
        path: 'auto-states',
        loadChildren: () => import('./pages/auto-states/auto-states.module').then(m => m.AutoStatesModule),
        data: { breadcrumb: 'Auto States LA' }
      },
      {
        path: 'location',
        loadChildren: () => import('./pages/location/location.module').then(m => m.LocationModule),
        data: { breadcrumb: 'Location Management' }
      },
      {
        path: 'circuit',
        loadChildren: () => import('./pages/circuit/circuit.module').then(m => m.CircuitModule),
        data: { breadcrumb: 'Circuit Management' }
      },
      {
        path: 'streettags',
        loadChildren: () => import('./pages/streettags/streettags.module').then(m => m.StreettagsModule),
        data: { breadcrumb: 'StreetTag Management' }
      },
      {
        path: 'leaderboard',
        loadChildren: () => import('./pages/leaderboard/leaderboard.module').then(m => m.LeaderboardModule),
        data: { breadcrumb: 'Leaderboard' }
      },
      {
        path: 'leaderboard-new',
        loadChildren: () => import('./pages/leaderboard-new/leaderboard-new.module').then(m => m.LeaderboardNewModule),
        data: { breadcrumb: 'Leaderboard New' }
      },
      {
        path: 'opportunities',
        loadChildren: () => import('./pages/opportunities/opportunities.module').then(m => m.OpportunitiesModule),
        data: { breadcrumb: 'Opportunities Management' }
      },
      {
        path: 'give-bonus-points',
        loadChildren: () => import('./pages/give-bonus-points/give-bonus-points.module').then(m => m.GiveBonusPointsModule),
        data: { breadcrumb: 'Give Bonus Points' }
      },
      {
        path: 'building',
        loadChildren: () => import('./pages/building/building.module').then(m => m.BuildingModule),
        data: { breadcrumb: 'Building Management' }
      },
      {
        path: 'floors',
        loadChildren: () => import('./pages/floors/floors.module').then(m => m.FloorsModule),
        data: { breadcrumb: 'Floors Management' }
      },
      {
        path: 'consents',
        loadChildren: () => import('./pages/consents/consents.module').then(m => m.ConsentsModule),
        data: { breadcrumb: 'Consents Management' }
      },
      {
        path: 'giftcard',
        loadChildren: () => import('./pages/giftcard/giftcard.module').then(m => m.GiftcardModule),
        data: { breadcrumb: 'Gift Card' }
      },
      {
        path: 'cancelgift',
        loadChildren: () => import('./pages/cancelgift/cancelgift.module').then(m => m.CancelgiftModule),
        data: { breadcrumb: 'Cancel Gift Card' }
      },
      {
        path: 'sendgift',
        loadChildren: () => import('./pages/sendgift/sendgift.module').then(m => m.SendgiftModule),
        data: { breadcrumb: 'Send Gift Card' }
      },
      {
        path: 'school',
        loadChildren: () => import('./pages/school/school.module').then(m => m.SchoolModule),
        data: { breadcrumb: 'School Management' }
      },
      {
        path: 'questionnaires',
        loadChildren: () => import('./pages/questionnaires/questionnaires.module').then(m => m.QuestionnairesModule),
        data: { breadcrumb: 'Questionnaires' }
      },
      {
        path: 'sponsor',
        loadChildren: () => import('./pages/sponsor/sponsor.module').then(m => m.SponsorModule),
        data: { breadcrumb: 'Sponsor Management' }
      },
      {
        path: 'vendor',
        loadChildren: () => import('./pages/vendor/vendor.module').then(m => m.VendorModule),
        data: { breadcrumb: 'Vendor Management' }
      },
      {
        path: 'schoolQr',
        loadChildren: () => import('./pages/cardqr/cardqr.module').then(m => m.CardqrModule),
        data: { breadcrumb: 'Generate School QR' }
      },
      {
        path: 'withdraw-approval',
        loadChildren: () => import('./pages/withdraw-approval/withdraw-approval.module').then(m => m.WithdrawApprovalModule),
        data: { breadcrumb: 'Withdrawal Request' }
      },
      {
        path: 'polytags',
        loadChildren: () => import('./pages/polytags/polytags.module').then(m => m.PolytagsModule),
        data: { breadcrumb: 'PolyTag Management' }
      },
      {
        path: 'trainer',
        loadChildren: () => import('./pages/trainer/trainer.module').then(m => m.TrainerModule),
        data: { breadcrumb: 'Trainer Management' }
      },
      {
        path: 'pecode',
        loadChildren: () => import('./pages/pecode/pecode.module').then(m => m.PecodeModule),
        data: { breadcrumb: 'Pecode Management' }
      },
      {
        path: 'charity',
        loadChildren: () => import('./pages/charity/charity.module').then(m => m.CharityModule),
        data: { breadcrumb: 'Charity Management' }
      },
      {
        path: 'steps-support',
        loadChildren: () => import('./pages/support/steps-support/steps-support.module').then(m => m.StepsSupportModule),
        data: { breadcrumb: 'Steps Support' }
      },
      {
        path: 'dob-change',
        loadChildren: () => import('./pages/dob-change/dob-change.module').then(m => m.DobChangeModule),
        data: { breadcrumb: 'DOB Change' }
      },
      {
        path: 'demo',
        loadChildren: () => import('./pages/demo/demo.module').then(m => m.DemoModule),
        data: { breadcrumb: 'Fruit Card Demo' }
      },
      {
        path: 'user-delete',
        loadChildren: () => import('./pages/user-delete/user-delete.module').then(m => m.UserDeleteModule),
        data: { breadcrumb: 'User Remove' }
      },
      {
        path: 'user-report',
        loadChildren: () => import('./pages/user-report/user-report.module').then(m => m.UserReportModule),
        data: { breadcrumb: 'User Report' }
      },
      {
        path: 'broadcast',
        loadChildren: () => import('./pages/broadcast/broadcast.module').then(m => m.BroadcastModule),
        data: { breadcrumb: 'Broadcast Management' }
      },
      {
        path: 'nfc',
        loadChildren: () => import('./pages/nfc-management/nfc.module').then(m => m.nfcModule),
        data: { breadcrumb: 'NFC Management' }
      },
      {
        path: 'monument',
        loadChildren: () => import('./pages/monuments/monuments.module').then(m => m.MonumentsModule),
        data: { breadcrumb: 'Monument Management' }
      },
      {
        path: 'report',
        loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule),
        data: { breadcrumb: 'Reports' }
      },
      {
        path: 'rf-registration',
        loadChildren: () => import('./pages/rf-registration/rf-registration.module').then(m => m.RfRegistrationModule),
        data: { breadcrumb: 'RF Registration' }
      },
      {
        path: 'rf-circuit',
        loadChildren: () => import('./pages/rf-circuit/rf-circuit.module').then(m => m.RfCircuitModule),
        data: { breadcrumb: 'RF Circuit' }
      },
      {
        path: 'rf-box',
        loadChildren: () => import('./pages/rf-box/rf-box.module').then(m => m.RfBoxModule),
        data: { breadcrumb: 'RF Box' }
      }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
