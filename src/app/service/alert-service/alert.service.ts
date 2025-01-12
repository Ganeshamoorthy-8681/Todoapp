import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _snackBar = inject(MatSnackBar);
  openToaster(message: string) {
    this._snackBar.open(message, "close", { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
  }
}
