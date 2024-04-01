import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note, NoteLabel } from '../../../service/data/note/note.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  @ViewChild('labelInput') labelInput!: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  public note!: Note;
  public label!: NoteLabel[];
  public formGroup!: FormGroup;
  public selectedDate!: Date;
  public duration: number = 1;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note, labels: NoteLabel[] },
  ) {
    this.note = JSON.parse(JSON.stringify(data.note)); // Copy note object
    this.label = data.labels; // Assign labels directly
    this.selectedDate = this.timestampToDate(this.note.startDate);
    this.duration = this.getDuration(this.note.startDate,this.note.endDate);
  }

  createForm() {
    this.formGroup = new FormGroup({
      title: new FormControl<string | null>(null),
      summary: new FormControl<string | null>(null),
      startDate: new FormControl<Date | null>(null),
    });
  }

  timestampToDate(timestamp?: number): Date {
    return timestamp ? new Date(timestamp * 1000) : new Date();
  }
  getDuration(startDate?: number, endDate?: number): number {
    if (startDate && endDate) {
      let date1 = new Date(startDate * 1000);
      let date2 = new Date(endDate * 1000);
      // Swap dates if date2 is before date1
      if (date2 < date1) {
        [date1, date2] = [date2, date1];
      }

      let weekdays = 0;
      const currentDate = new Date(date1);
      while (currentDate <= date2) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          weekdays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return weekdays;
    }
    return 0;
  }
  calculateEndDate(startDate: number, duration: number): number {
    const millisecondsInADay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTime = new Date(startDate * 1000);
    let currentDate = new Date(startDateTime); // Start from the given start date
  
    let remainingDuration = duration;
    
    // Loop until the remaining duration becomes 0
    while (remainingDuration > 0) {
      // Increment currentDate by one day
      currentDate.setTime(currentDate.getTime() + millisecondsInADay);
  
      // Check if the current day is not Saturday (6) or Sunday (0)
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        remainingDuration--; // Decrease the remaining duration only for weekdays
      }
    }
    
    // Return the Unix timestamp of the end date
    return Math.floor(currentDate.getTime() / 1000);
  }
  doAction() {
    this.note.startDate = Math.floor(new Date(this.selectedDate).getTime() / 1000);
    this.note.endDate = this.calculateEndDate(this.note.startDate,this.duration-1);
    this.dialogRef.close({ data: this.note, event: "Save" });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    let valueExistsInList = false;
    let id = -1;

    for (const key in this.label) {
      if (this.label.hasOwnProperty(key)) {
        const element = this.label[key];
        if (element.text.toUpperCase() === (value.toUpperCase())) {
          valueExistsInList = true;
          id = element.id
        }
      }
    }
    if (valueExistsInList) {

      const index = this.note.labels.indexOf(id);
      if (index === -1) {
        this.note.labels.push(id);
      }
      event.chipInput!.clear();
    }
  }

  addLabel(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.viewValue);
    
    const value = event.option.viewValue;
    let valueExistsInList = false;
    let id = -1;

    for (const key in this.label) {
      if (this.label.hasOwnProperty(key)) {
        const element = this.label[key];
        if (element.text.toUpperCase() === (value.toUpperCase())) {
          valueExistsInList = true;
          id = element.id
        }
      }
    }
    if (valueExistsInList) {

      const index = this.note.labels.indexOf(id);
      if (index === -1) {
        this.note.labels.push(id);
      }
      this.labelInput.nativeElement.value = '';
    }
  }

  removeLabel(item: number) {
    const index = this.note.labels.indexOf(item);
    if (index !== -1) {
      this.note.labels.splice(index, 1);
    }
  }

  getLabelName(id: number) {
    const foundLabel = this.label.find(label => label.id === id);
    return foundLabel ? foundLabel.text : '';
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }
}
