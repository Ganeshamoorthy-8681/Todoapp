import { Component } from '@angular/core';
import { TaskListComponentModel } from '../task-list/model/task-list-component.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AbstractCreateTask } from '../../abstracts/Abstract-create-task';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertService } from '../../service/alert-service/alert.service';
import { TaskService } from '../../service/task-service/task.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    TaskListComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent extends AbstractCreateTask {
  protected dialogRef: MatDialogRef<TaskFormComponent | DialogComponent>;
  protected dialogComponentOutputEventSubscription: Subscription;

  $refreshDataSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  taskListComponentData: TaskListComponentModel = {
    isFilterRequired: true,
    isTodaysTask: false,
    $refreshDataSubject: this.$refreshDataSubject
  };
  constructor (
    protected alertService: AlertService,
    protected taskService: TaskService,
    protected dialog: MatDialog
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.destroyCreateTaskSubscription();
  }

  handleCreateTaskSuccessResponse(): void {
    this.dialogRef?.close();
    this.$refreshDataSubject.next(true);
  }

  destroyDialogOutputEventsSubscription(): void {
    this.dialogComponentOutputEventSubscription?.unsubscribe();
  }

}
