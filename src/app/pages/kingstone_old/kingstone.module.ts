import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogAddKingstone, DialogEditKingstone, KingstoneComponent } from './kingstone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';

export const routes = [
  { path: '', component: KingstoneComponent, pathMatch: 'full' }
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
    KingstoneComponent,
    DialogAddKingstone,
    DialogEditKingstone,
  ],
  entryComponents:[
    DialogAddKingstone,
    DialogEditKingstone,
  ]
})
export class KingstoneModule { }
