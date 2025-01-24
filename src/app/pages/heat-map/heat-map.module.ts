import { AgmCoreModule } from '@agm/core';
import { AgmMarkerClustererModule } from '@agm/markerclusterer';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HeatMapComponent } from './heat-map.component';


export const routes = [
  { path: '', component: HeatMapComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0',
        }),
    AgmMarkerClustererModule,  
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,     
    SharedModule,
    PipesModule,
    MatTableModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    HeatMapComponent
  ]
})
export class HeatMapingModule { 
 
}