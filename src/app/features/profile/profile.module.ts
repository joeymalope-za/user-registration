import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ChartComponent } from '../../chart/chart.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule, // Imports the CommonModule
    ChartComponent,
  ],
  exports: [],
})
export class ProfileModule {}
