import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { EditDialogComponent } from './edit-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDatepickerModule,
    ReactiveFormsModule,
    JsonPipe,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
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
