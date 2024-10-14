import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TaskCountByStatusComponent } from '../task-count-by-status/task-count-by-status.component';
import { RecentlyUpdatedTaskComponent } from '../recently-updated-task/recently-updated-task.component';
import { TaskListComponentModel } from '../task-list/model/task-list-component.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFormModel } from '../task-form/task-form.model';
import { TaskService } from '../../service/task-service/task.service';
import { AlertComponent } from '../alert/alert.component';
import { AlertComponentModel } from '../alert/model/alert-model';
import { AlertService } from '../../service/alert-service/alert.service';
import { AbstractCreateTask } from '../../abstracts/Abstract-create-task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TaskCountByStatusComponent,
    RecentlyUpdatedTaskComponent,
    TaskListComponent,
    MatToolbarModule,
    MatButtonModule,
    AlertComponent,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends AbstractCreateTask implements OnDestroy {

  protected dialogRef: MatDialogRef<TaskFormComponent | DialogComponent>;
  $refreshDataSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  taskListComponentData: TaskListComponentModel = {
    title: "My Today's Task",
    isFilterRequired: false,
    isTodaysTask: true,
    $refreshDataSubject: this.$refreshDataSubject
  };

  protected dialogComponentOutputEventSubscription: Subscription;


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
    this.$refreshDataSubject?.next(true);
  }

  destroyDialogOutputEventsSubscription(): void {
    this.dialogComponentOutputEventSubscription?.unsubscribe();
  }

}
