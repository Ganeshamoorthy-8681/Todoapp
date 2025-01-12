import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TaskModel } from '../../model/response/task.model';
import { MatButtonModule } from '@angular/material/button';
import { TASK_PRIORITY_MAPPER } from '../../model/mapper/task-priority-mapper';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { TASK_STATUS_MAPPER } from '../../model/mapper/task-status-mapper';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { Subscription } from 'rxjs';
import { TaskService } from '../../service/task-service/task.service';
import { AlertService } from '../../service/alert-service/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, DatePipe, NgClass, MatTooltipModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {

  private dialogRef: MatDialogRef<DeleteTaskDialogComponent>;
  private dialogSubscription: Subscription;

  @Input() task: TaskModel;
  @Output() event = new EventEmitter();

  constructor (
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private taskService: TaskService,
    private alertService: AlertService
  ) { }


  handleTaskClickEvent(): void {
    this.navigationService.navigate(["app", 'tasks', this.task.id.toString()]);
  }

  handleTaskEditEvent(event: MouseEvent): void {
    event.stopPropagation();
    this.navigationService.navigate(["app", "tasks", "edit", this.task.id.toString()]);
  }

  handleTaskDeleteEvent(event: MouseEvent): void {
    event.stopPropagation();
    this.dialogRef = this.dialog.open(DeleteTaskDialogComponent, { width: '500px' });
    this.listenDialogEvent();
  }

  listenDialogEvent(): void {
    this.dialogSubscription?.unsubscribe();
    this.dialogSubscription = this.dialogRef.componentInstance.event.subscribe((value) => {
      if (value) {
        this.dialogRef.componentInstance.isLoading = true;
        this.deleteTask();
      }
    });
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.dialogRef.componentInstance.isLoading = false;
        this.alertService.openToaster("Task Deleted SuccessFully.");
        this.navigationService.navigate(["app", "tasks"], { refresh: true });
      },
      error: () => {
        this.dialogRef.componentInstance.isLoading = false;
        this.alertService.openToaster("Unable to Delete the Task.");

      }

    });

  }


  //Helpers

  getPriorityClass(): string {
    return TASK_PRIORITY_MAPPER[this.task.taskPriority].class;
  }

  getDisplayName(): string {
    if (!this.task.taskPriority) return '';
    return TASK_PRIORITY_MAPPER[this.task.taskPriority].displayName;
  }

  isTaskOverdue(): boolean {
    return this.task.dueDate < Date.now();
  }

  getStatusClassName(): string {
    return TASK_STATUS_MAPPER[this.task.taskStatus].class;
  }

  getStatusDisplayName(): string {
    return TASK_STATUS_MAPPER[this.task.taskStatus].displayName;
  }
}
