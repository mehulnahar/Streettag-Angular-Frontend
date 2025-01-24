import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ActiveTeamComponent, AddActiveStatusDialogBox, EditActiveStatusDialogBox } from './active-team.component';

export const routes = [
  { path: '', component: ActiveTeamComponent, pathMatch: 'full' }
];

const COMPONENTS = [ActiveTeamComponent];
const COMPONENTS_DYNAMIC = [EditActiveStatusDialogBox,AddActiveStatusDialogBox];

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
  declarations: [...COMPONENTS,...COMPONENTS_DYNAMIC],
  entryComponents:COMPONENTS_DYNAMIC
})
export class ActiveTeamModule { }
