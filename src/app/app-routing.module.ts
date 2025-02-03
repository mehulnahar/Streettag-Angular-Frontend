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
        path: 'opportunities',
        loadChildren: () => import('./pages/opportunities/opportunities.module').then(m => m.OpportunitiesModule),
        data: { breadcrumb: 'Opportunities Management' }
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
