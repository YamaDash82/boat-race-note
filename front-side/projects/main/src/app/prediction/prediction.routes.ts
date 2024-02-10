import { Routes } from "@angular/router";
import { RaceTableComponent } from "./race-table/race-table.component";
import { RaceIndexComponent } from "./race-index/race-index.component";
import { ContentsComponent } from "./contents/contents.component";

export const predictionRoutes: Routes = [
  { path: 'race-index', component: RaceIndexComponent, }, 
  { 
    path: 'contents', 
    component: ContentsComponent, 
    children: [
      { path: 'exhibition', component: RaceTableComponent }, 
    ]
  }, 
]