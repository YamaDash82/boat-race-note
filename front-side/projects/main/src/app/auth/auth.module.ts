import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AppendUserComponent } from './append-user/append-user.component';

@NgModule({
  declarations: [
    LoginComponent,
    AppendUserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatInputModule,
  ]
})
export class AuthModule { }
