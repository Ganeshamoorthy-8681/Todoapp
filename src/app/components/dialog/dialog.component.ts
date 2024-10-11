import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {


  constructor (private dialogRef: MatDialogRef<DialogComponent>) { };

  handleActionClick() {
    this.dialogRef.close(true);
  }
}
