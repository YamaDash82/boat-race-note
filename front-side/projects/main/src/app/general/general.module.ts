import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { NumberKeysComponent } from './number-keys/number-keys.component';


@NgModule({
  declarations: [
    PaginatorComponent,
    NumberKeysComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule, 
  ],
  exports: [
    PaginatorComponent, 
    NumberKeysComponent, 
  ]
})
export class GeneralModule { }
