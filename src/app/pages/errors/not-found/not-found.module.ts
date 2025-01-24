import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export const routes = [
{ path: '', component: NotFoundComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
   ],
  declarations: [
    NotFoundComponent
   ]
})
export class NotFoundModule { }
