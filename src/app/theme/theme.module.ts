import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MatExpansionModule } from '@angular/material/expansion';

import { TopInfoContentComponent } from './components/top-info-content/top-info-content.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HorizontalMenuComponent } from './components/menu/horizontal-menu/horizontal-menu.component';
import { VerticalMenuComponent } from './components/menu/vertical-menu/vertical-menu.component';

@NgModule({
  declarations: [
    TopInfoContentComponent,
    FullScreenComponent,
    UserMenuComponent,
    SidenavComponent,
    HorizontalMenuComponent,
    VerticalMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    MatExpansionModule
  ],
  exports: [
    TopInfoContentComponent,
    FullScreenComponent,
    UserMenuComponent,
    SidenavComponent,
    HorizontalMenuComponent,
    VerticalMenuComponent
  ]
})
export class ThemeModule { } 