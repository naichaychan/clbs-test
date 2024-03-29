import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../service/data/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { Note, NoteLabel } from '../../service/data/note/note.model';
import { EditDialogComponent } from '../../component/note/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  labels: string[] = ['frontend', 'backend', 'security'];
  selectedLabel: number = -1;
  notes: Note[] = [];
  noteLabels: NoteLabel[] = [];
  selectedNote: Note | null = null;
  loading = false;

  constructor(
    private noteService: NoteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getNotes();
  }

  async getNotes() {
    this.loading = true;
    try {
      this.notes = await (await this.noteService.getNotes()).toPromise();
      this.getNoteLabels();
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      this.loading = false;
    }
  }

  async getNoteLabels() {
    this.loading = true;
    try {
      this.noteLabels = await (await this.noteService.getNoteLabels()).toPromise();
    } catch (error) {
      console.error('Error fetching note labels:', error);
    } finally {
      this.loading = false;
    }
  }

  getNotesByLabel(label: number): Note[] {
    return this.selectedLabel === -1 ? this.notes : this.notes.filter(note => note.labels?.includes(this.selectedLabel));
  }

  openEditDialog(note: Note) {
    this.selectedNote = note;
    this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { note: this.selectedNote }
    });
  }

  saveNote() {
    // Implement logic to save edited note
    console.log('Saving note:', this.selectedNote);
    // Clear selected note after saving
    this.selectedNote = null;
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
      // Iterate over each day between the two dates
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

  // Function to get an array of days in the current week
  get daysInWeek() {
    const currentDate = new Date();
    const daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const firstDay = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i));
      daysInWeek.push(firstDay.toLocaleDateString('en-US', { weekday: 'long' }));
    }
    return daysInWeek;
  }

  // Function to get notes for a specific label and day
  getNotesByLabelAndDay(label: number, day: string): Note[] {
    return this.getNotesByLabel(label).filter(note => {
      const noteDay = new Date(note.startDate * 1000).toLocaleDateString('en-US', { weekday: 'long' });
      return noteDay === day;
    });
  }
}
