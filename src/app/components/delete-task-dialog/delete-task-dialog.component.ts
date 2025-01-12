import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './delete-task-dialog.component.html',
  styleUrl: './delete-task-dialog.component.scss'
})
export class DeleteTaskDialogComponent {

  isLoading: boolean = false;

  @Output() event = new EventEmitter();

  handleActionClick() {
    this.event.emit(true);
  }
}
