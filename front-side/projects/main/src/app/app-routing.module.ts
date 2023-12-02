import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { predictionRoutes } from './prediction/prediction.routes';

const routes: Routes = [
  { path: 'prediction', children: predictionRoutes, }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
