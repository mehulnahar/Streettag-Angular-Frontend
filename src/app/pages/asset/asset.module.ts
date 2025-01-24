import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetComponent, DeleteAsset, DialogAddAsset, DialogEditAsset } from './asset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';

export const routes = [
  { path: '', component: AssetComponent, pathMatch: 'full' }
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
    AssetComponent,
    DialogAddAsset,
    DialogEditAsset,
    DeleteAsset
  ],
  entryComponents:[
    DialogAddAsset,
    DialogEditAsset,
    DeleteAsset
  ]
})
export class AssetModule { }
