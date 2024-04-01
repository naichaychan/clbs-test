import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { EditDialogComponent } from './edit-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SharedModule } from '../../../service/module/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    EditDialogComponent
  ],
  exports: [
    EditDialogComponent
  ],
  providers: [provideNativeDateAdapter()],
})
export class EditDialogModule { }
