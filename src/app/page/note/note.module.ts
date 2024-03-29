import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { NoteComponent } from './note.component';
import { SharedModule } from '../../service/module/shared/shared.module';
import { ProgressSpinerModule } from '../../component/common/progress-spiner/progress-spiner.module';
import { EditDialogModule } from '../../component/note/edit-dialog/edit-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    NoteRoutingModule,
    SharedModule,
    ProgressSpinerModule,
    EditDialogModule
  ],
  declarations: [
    NoteComponent
  ],
})
export class NoteModule { }
