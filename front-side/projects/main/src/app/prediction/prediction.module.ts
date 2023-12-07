import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceTableComponent } from './race-table/race-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PredictionFormService } from './prediction-form.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    RaceTableComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
  ], 
  providers: [ 
    PredictionFormService, 
  ]
})
export class PredictionModule { }
