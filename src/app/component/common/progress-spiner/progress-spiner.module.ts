import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinerComponent } from './progress-spiner.component';
import { SharedModule } from '../../../service/module/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ProgressSpinerComponent],
  exports: [ProgressSpinerComponent]
})
export class ProgressSpinerModule { }
