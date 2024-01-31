import { Routes } from "@angular/router";
import { RaceTableComponent } from "./race-table/race-table.component";
import { RaceIndexComponent } from "./race-index/race-index.component";

export const predictionRoutes: Routes = [
  { path: 'race-index', component: RaceIndexComponent, }, 
  { path: '', component: RaceTableComponent }, 
]