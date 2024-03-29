import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarConfig,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _snackBar: MatSnackBar) { }

  async Alert(title: string, message: string, color: string='dark') {
    let config:MatSnackBarConfig = {
    announcementMessage: title,
    duration: 6000,
    direction: 'rtl',
    horizontalPosition: 'right',
    verticalPosition: 'top'
    }
    this._snackBar.open(title,'Close',config);
  }

}
