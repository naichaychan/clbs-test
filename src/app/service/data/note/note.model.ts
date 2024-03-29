export class Note{
  id!: number;
  title!: string;
  summary!: string;
  labels!: number[];
  startDate!: number;
  endDate!: number;
}

export class NoteLabel{
  id!: number;
  text!: string;
}
