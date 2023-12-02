import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceTableComponent } from './race-table/race-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PredictionFormService } from './prediction-form.service';

@NgModule({
  declarations: [
    RaceTableComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
  ], 
  providers: [ 
    PredictionFormService, 
  ]
})
export class PredictionModule { }
