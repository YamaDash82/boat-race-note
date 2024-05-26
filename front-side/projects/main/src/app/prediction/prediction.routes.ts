import { Routes } from "@angular/router";
import { RaceIndexComponent } from "./race-index/race-index.component";
import { ContentsComponent } from "./contents/contents.component";
import { ExhibitionComponent } from "./exhibition/exhibition.component";
import { ApproachPredictionComponent } from "./approach-prediction/approach-prediction.component";
import { DeploymentPredictionComponent } from "./deployment-prediction/deployment-prediction.component";
import { RaceResultComponent } from "./race-result/race-result.component";
import { PredictionTopComponent } from "./prediction-top/prediction-top.component";

export const predictionRoutes: Routes = [
  { path: 'race-index', component: RaceIndexComponent, }, 
  { 
    path: 'contents', 
    component: ContentsComponent, 
    children: [
      { path: 'exhibition', component: ExhibitionComponent }, 
      { path: 'approach-prediction', component: ApproachPredictionComponent }, 
      { path: 'deployment-prediction', component: DeploymentPredictionComponent }, 
      { path: 'race-result', component: RaceResultComponent }, 
    ], 
  }, 
  { path: '', component: PredictionTopComponent }, 
]