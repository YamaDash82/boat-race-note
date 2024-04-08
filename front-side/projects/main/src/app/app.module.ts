import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PredictionModule } from './prediction/prediction.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('auth_tkn');
        },
        allowedDomains: [ 'localhost:3000' ]
      }
    }),
    AuthModule, 
    PredictionModule, 
  ],
  providers: [
    AuthService, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
