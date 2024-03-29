import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { NoteComponent } from './note.component';
import { SharedModule } from '../../service/module/shared/shared.module';


@NgModule({
  declarations: [
    NoteComponent
  ],
  imports: [
    CommonModule,
    NoteRoutingModule,
    SharedModule
  ]
})
export class NoteModule { }
