import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Note } from './note.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private urlNote = `notes/`;
  private urlNoteLabel = `noteLabels/`;
  constructor(private httpService: HttpService) { }


  async getNotes(): Promise<Observable<any>> {
    return this.httpService.get(this.urlNote);
  }

  async getNoteLabels(): Promise<Observable<any>> {
    return this.httpService.get(this.urlNoteLabel);
  }

  async updateNote(noteID:number,noteDetail:Note): Promise<Observable<any>> {
    const reqData=noteDetail;
    return this.httpService.put(this.urlNote+'1', reqData);
  }

}
