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

  private darkMode = false;
  constructor(private _snackBar: MatSnackBar) { }

  async Alert(title: string, message: string, color: string='dark') {
    let config:MatSnackBarConfig = {
    announcementMessage: title,
    duration: 6000,
    direction: 'ltr',
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['mat-'+color]
    }
    this._snackBar.open(title+','+message,'X',config);
  }


  toggleDarkMode(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
