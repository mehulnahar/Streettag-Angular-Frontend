import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { BuildingComponent, DialogOverviewAddBuilding, DialogOverviewBuilding } from './building.component';


export const routes = [
  { path: '', component: BuildingComponent, pathMatch: 'full' }
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
  declarations: [
    BuildingComponent,
    DialogOverviewAddBuilding,
    DialogOverviewBuilding,
  ],
  entryComponents:[DialogOverviewAddBuilding,
    DialogOverviewBuilding
 ]
})
export class BuildingModule { }
