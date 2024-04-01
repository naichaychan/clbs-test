import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../service/data/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { Note, NoteLabel } from '../../service/data/note/note.model';
import { EditDialogComponent } from '../../component/note/edit-dialog/edit-dialog.component';
import { CommonService } from '../../service/common/common.service';

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
  selectedNote!: Note ;
  loading = false;
  displayedWeek: Date[] = [];
  selectedLabelName: string = 'All';

  constructor(private commonService: CommonService,
    private noteService: NoteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let startDate = new Date('01/01/2022');
    this.displayedWeek = this.getWeekDates(startDate);
    this.getNotes();
    this.getNoteLabels();
  }

  async getNotes() {
    this.loading = true;
    await (await this.noteService.getNotes()).toPromise()
    .then(data=>{
      this.notes = data;
    })
    .catch(error =>{
      this.commonService.Alert('Error fetching notes:', error.msg,'warn');
    })
    .finally(()=>{
      this.loading = false;
    });
  }

  async getNoteLabels() {
    this.loading = true;

    await (await this.noteService.getNoteLabels()).toPromise()
    .then(data=>{
      this.noteLabels = data;
    })
    .catch(error =>{
      this.commonService.Alert('Error fetching note labels:', error.msg,'warn');
    })
    .finally(()=>{
      this.loading = false;
    });

  }
  async updateNote(note:Note) {
    this.loading = true;

    await (await this.noteService.updateNote(note.id,note)).toPromise()
    .then(data=>{
      this.selectedNote = data;
    })
    .catch(error =>{
      console.log(error);
      this.commonService.Alert('Error update note detial:', error.msg,'warn');
    })
    .finally(()=>{
      this.loading = false;
      this.getNotes();
    });

  }

  openEditDialog(note: Note) {
    this.selectedNote = note;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { note: this.selectedNote, labels: this.noteLabels }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.event === 'Save'){

        let tempNote = result.data;
        let countStack = 0;
        tempNote.labels.forEach((xlabel: number) => {
          this.getNotesByLabelAndDay(xlabel, this.timestampToDate(tempNote.startDate)).forEach(stack=>{
            countStack++;
          });
        });
        if(countStack < 3)
        {
          this.selectedNote = tempNote;

          this.notes.forEach(item=>{
            if(item.id == this.selectedNote.id)
            {
              item.title = this.selectedNote.title;
              item.labels = this.selectedNote.labels;
              item.startDate = this.selectedNote.startDate;
              item.endDate = this.selectedNote.endDate;
              item.summary = this.selectedNote.summary;
            }
          })
          console.log(this.selectedNote);
          this.updateNote(this.selectedNote);
        }
        else
        {
          this.commonService.Alert('Update Note Error', 'Maximum stack in day (3)','warn');
        }
      }
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

  daysInWeek() {
    const currentDate = new Date();
    const daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const firstDay = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i));
      daysInWeek.push(firstDay.toLocaleDateString('en-US', { weekday: 'long' }));
    }
    return daysInWeek;
  }

  getNotesByLabelAndDay(labelId: number, day: Date): Note[] {
    // Filter notes based on labelId and day
    if (labelId == -1) {
      return this.notes.filter(note =>
        this.isSameDay(new Date(note.startDate * 1000), day)
      );
    } else {
      return this.notes.filter(note =>
        note.labels.includes(labelId) &&
        this.isSameDay(new Date(note.startDate * 1000), day)
      );
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  fetchPreviousWeek() {
    const firstDateOfWeek = this.displayedWeek[0];
    const previousWeekFirstDate = new Date(firstDateOfWeek);
    previousWeekFirstDate.setDate(previousWeekFirstDate.getDate() - 7);
    this.displayedWeek = this.getWeekDates(previousWeekFirstDate);
  }

  fetchNextWeek() {
    const lastDateOfWeek = this.displayedWeek[this.displayedWeek.length - 1];
    const nextWeekFirstDate = new Date(lastDateOfWeek);
    nextWeekFirstDate.setDate(nextWeekFirstDate.getDate() + 1);
    this.displayedWeek = this.getWeekDates(nextWeekFirstDate);
  }

  getWeekDates(startDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 7; i++) { // Loop for 5 days to exclude weekends
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + i);
      if (nextDay.getDay() !== 0 && nextDay.getDay() !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(new Date(nextDay));
      }
    }

    return dates;
  }



  onLabelChange() {
    if (this.selectedLabel == -1) {
      this.selectedLabelName = 'All';
    } else {
      const selectedLabel = this.noteLabels.find(label => label.id === this.selectedLabel);
      console.log(selectedLabel);
      this.selectedLabelName = selectedLabel ? selectedLabel.text : 'Unknown';
    }

    console.log(this.selectedLabel);
  }

  calculateRowHeight(labelID: number): number {
    const notesForLabel = this.notes.filter(note => note.labels.includes(labelID));
    const numCards = notesForLabel.length;
    // Set a minimum height for the row, adjust as needed
    const minHeight = 100;
    // Calculate the height based on the number of cards
    return minHeight + numCards * 10; // Adjust the multiplier based on the desired card height
  }


  toggleDarkMode(isDarkMode: boolean){
    this.commonService.toggleDarkMode(isDarkMode);
  }

}
