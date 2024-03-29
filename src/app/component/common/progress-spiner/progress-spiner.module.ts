import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinerComponent } from './progress-spiner.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProgressSpinerComponent
  ],
  exports: [
    ProgressSpinerComponent
  ]
})
export class ProgressSpinerModule { }
