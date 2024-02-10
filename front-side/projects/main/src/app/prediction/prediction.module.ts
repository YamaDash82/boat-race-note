import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaceTableComponent } from './race-table/race-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PredictionFormService } from './prediction-form.service';
import { HttpClientModule } from '@angular/common/http';
import { RaceIndexComponent } from './race-index/race-index.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { JPDateAdapter } from '../common/jp-date-adapter';
import { MatButtonModule } from '@angular/material/button';
import { RacerPeriodResultComponent } from './racer-period-result/racer-period-result.component';
import { ContentsComponent } from './contents/contents.component';
import { AppRoutingModule } from '../app-routing.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    RaceTableComponent,
    RaceIndexComponent,
    RacerPeriodResultComponent,
    ContentsComponent
  ],
  imports: [
    CommonModule, 
    AppRoutingModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatButtonModule, 
    MatIconModule, 
  ], 
  providers: [ 
    //PredictionFormService, 
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' }, 
    { provide: DateAdapter, useClass: JPDateAdapter }
  ]
})
export class PredictionModule { }
