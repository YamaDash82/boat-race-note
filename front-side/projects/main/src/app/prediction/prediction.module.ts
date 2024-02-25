import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ApproachFormationComponent } from './approach-formation/approach-formation.component';
import { SailingExhibitionComponent } from './sailing-exhibition/sailing-exhibition.component';
import { ExhibitionComponent } from './exhibition/exhibition.component';
import { ApproachPredictionComponent } from './approach-prediction/approach-prediction.component';
import { DeploymentPredictionComponent } from './deployment-prediction/deployment-prediction.component';
import { RaceResultComponent } from './race-result/race-result.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GeneralModule } from '../general/general.module';

@NgModule({
  declarations: [
    RaceIndexComponent,
    RacerPeriodResultComponent,
    ContentsComponent,
    ApproachFormationComponent,
    SailingExhibitionComponent,
    ExhibitionComponent,
    ApproachPredictionComponent,
    DeploymentPredictionComponent,
    RaceResultComponent
  ],
  imports: [
    CommonModule, 
    AppRoutingModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    GeneralModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatButtonModule, 
    MatIconModule, 
    DragDropModule, 
  ], 
  providers: [ 
    //PredictionFormService, 
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' }, 
    { provide: DateAdapter, useClass: JPDateAdapter }
  ]
})
export class PredictionModule { }
