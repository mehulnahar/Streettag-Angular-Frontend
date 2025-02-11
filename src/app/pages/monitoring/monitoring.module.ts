import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ExcelService } from 'src/app/excel.service';
import { PDFService } from 'src/app/pdf.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { MonitoringComponent } from './monitoring.component';


export const routes = [
  { path: '', component: MonitoringComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    MonitoringComponent
  ],
  providers:[ExcelService ,PDFService]

})
export class MonitoringModule { 
  constructor(){
   }
}