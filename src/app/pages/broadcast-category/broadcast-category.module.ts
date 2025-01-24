import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { BroadcastCategoryComponent, DialogAddBroadcastCategory, DialogEditBroadcastCategory } from './broadcast-category.component';


export const routes = [
  { path: '', component: BroadcastCategoryComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    MatTableModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    BroadcastCategoryComponent,
    DialogAddBroadcastCategory,
    DialogEditBroadcastCategory
  ],
  entryComponents:[
    DialogAddBroadcastCategory,
    DialogEditBroadcastCategory
  ]
})
export class BroadcastCategoryModule { }
