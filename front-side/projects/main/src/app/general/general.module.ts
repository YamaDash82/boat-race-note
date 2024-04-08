import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule, 
  ],
  exports: [
    PaginatorComponent, 
  ]
})
export class GeneralModule { }
