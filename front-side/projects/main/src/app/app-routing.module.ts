import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { predictionRoutes } from './prediction/prediction.routes';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: 'prediction', 
    children: predictionRoutes, 
    canActivate: [ authGuard ],
  }, 
  { path: 'login', component: LoginComponent }, 
  { path: '', redirectTo: 'prediction', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
