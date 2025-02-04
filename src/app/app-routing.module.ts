import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PagesComponent } from './pages/pages.component';

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
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
