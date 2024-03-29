import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../service/data/note/note.service';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent implements OnInit{

  constructor(private commonService: CommonService,
    private noteService: NoteService) {
      this.getNote();
  }

  ngOnInit(): void {
  }

  async getNote(){
    (await this.noteService.getNote()).subscribe(async data=>{
      console.log(data);
    },
    async (error: Error) => {
    });
  }

  alert(){
    this.commonService.Alert('test','msg','danger');
  }
}
