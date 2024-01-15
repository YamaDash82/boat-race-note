import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { predictionRoutes } from './prediction/prediction.routes';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: 'prediction', children: predictionRoutes, }, 
  { path: 'login', component: LoginComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
