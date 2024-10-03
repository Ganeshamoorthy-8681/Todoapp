import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TaskCardComponentModel } from './model/task-card.model';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { every } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-card',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatCardModule, DatePipe, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {

  @Input({ required: true }) data!: TaskCardComponentModel;

  handleEditButtonEvent(event: MouseEvent) {
    console.log(event);
  }

  handleDeleteButtonEvent(event: MouseEvent) {
    console.log(event);
  }
}
