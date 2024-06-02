import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { predictionRoutes } from './prediction/prediction.routes';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AppendUserComponent } from './auth/append-user/append-user.component';
import { PredictionTopComponent } from './prediction/prediction-top/prediction-top.component';
import { racePredictionResolver } from './resolvers/race-prediction.resolver';

const routes: Routes = [
  /*
  { 
    path: 'prediction', 
    children: predictionRoutes, 
    canActivate: [ authGuard ],
  }, 
  */
  {
    path: 'prediction',
    children: [
      { 
        path: 'new-prediction', 
        children: predictionRoutes,
        resolve: [ racePredictionResolver ]
      },
      { 
        path: ':prediction-key', 
        children: predictionRoutes,
        resolve: [ racePredictionResolver ]
      }, 
      { path: '', component: PredictionTopComponent },
    ],
    canActivate: [ authGuard ],
  },
  { 
    path: 'auth', 
    children: [
     { path: 'login', component: LoginComponent }, 
     { path: 'append-user', component: AppendUserComponent }, 
    ], 
  }, 
  { path: '', redirectTo: 'prediction', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
