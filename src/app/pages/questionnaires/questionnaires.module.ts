import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { QuestionnairesComponent } from './questionnaires.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

export const routes: Routes = [
  { path: '', component: QuestionnairesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    // Material Modules
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  declarations: [
    QuestionnairesComponent
  ]
})
export class QuestionnairesModule { }
