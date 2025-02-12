import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QuesReportComponent } from './ques-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExcelService } from 'src/app/excel.service';
import { QuesReportService } from './ques-report.service';

export const routes = [
  { path: '', component: QuesReportComponent, pathMatch: 'full' as const }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),  
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule
  ],
  declarations: [
    QuesReportComponent
  ],
  providers: [
    DatePipe,
    ExcelService,
    QuesReportService
  ]
})
export class QuesReportModule { }




