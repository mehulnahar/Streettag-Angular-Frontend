import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { TrainerComponent, DialogBoxAddTrainer, EditTrainersPopUp } from './trainer.component';

export const routes = [
  { path: '', component: TrainerComponent, pathMatch: 'full' }
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
  ],
  declarations: [
    TrainerComponent,
    DialogBoxAddTrainer,
    EditTrainersPopUp
  ],

  entryComponents:[
    TrainerComponent,
    DialogBoxAddTrainer,
    EditTrainersPopUp
  ]
  
})
export class TrainerModule { }
