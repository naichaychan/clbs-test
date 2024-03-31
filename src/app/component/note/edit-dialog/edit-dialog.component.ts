import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note, NoteLabel } from '../../../service/data/note/note.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  public note!: Note ;
  public label!: NoteLabel[] ;
  public formGroup!: FormGroup;
  public selectedDate!: Date;
  public duration: number = 1;

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {note:Note,labels: NoteLabel[]},){
      this.note = Object.assign({}, data.note);
      this.label = Object.assign({}, data.labels);
      this.selectedDate = this.timestampToDate(this.note.startDate );
      console.log(data);
  }
  createForm(){
    this.formGroup = new FormGroup({
      title: new FormControl<string | null>(null),
      summary: new FormControl<string | null>(null),
      startDate: new FormControl<Date | null>(null),
    });
  }

  timestampToDate(timestamp?: number): Date {
    return timestamp ? new Date(timestamp * 1000) : new Date();
  }

  doAction(){

    this.note.startDate =  Math.floor(new Date(this.selectedDate).getTime() / 1000);
    this.note.endDate =  (this.note.startDate + ((this.duration-1)*60*24));
    this.data.note = this.note;
    this.dialogRef.close({data:this.note,event:"Save"});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  removeItem(item: number) {
    const index = this.note.labels.indexOf(item);
    if (index !== -1) {
      this.note.labels.splice(index, 1);
    }
  }

  getLabelName(id:number){
    return this.label?.filter(item => item.id == id);
  }
}
