import { DatePipe, JsonPipe, NgClass, NgIf } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormFooterActions } from '../../enum/form-footer-actions.model';
import { TaskStatus } from '../../enum/task-status.model';
import { TASK_STATUS_MAPPER } from '../../model/mapper/task-status-mapper';
import { TaskModel } from '../../model/response/task.model';
import { PaginationUtil } from '../../util/Paginationutil';
import { DialogComponent } from '../dialog/dialog.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFormOutputEventModel, TaskFormModel } from '../task-form/task-form.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../service/task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TaskListComponentModel } from './model/task-list-component.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    NgClass,
    MatFormFieldModule,
    MatSelectModule,
    JsonPipe,
    NgIf,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatChipsModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {

  @Input() data: TaskListComponentModel;

  private dialogRef: MatDialogRef<TaskFormComponent | DialogComponent>;

  displayedColumns = ["name", "description", "status", "dueDate", "updatedAt", "createdAt", "actions"];
  pageSize: number = 10;
  pageNumber: number = 0;
  totalRecords: number;
  dataSource: TaskModel[] = [];
  isTodaysTaskListLoading: boolean;

  private deleteTaskSubscription: Subscription;
  private updateTaskSubscription: Subscription;
  private createTaskSubscription: Subscription;
  private todaysTaskListSubscription: Subscription;
  private refreshDataSubscription: Subscription | undefined;
  private dialogComponentOutputEventSubscription: Subscription;
  taskStatus: any;

  constructor (
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.data?.isTodaysTask ? this.getTodaysTaskList() : this.getTaskList();
    this.listenDataRefreshSubject();
  }

  ngOnDestroy(): void {
    this.destroyCreateTaskSubscription();
    this.destroyDeleteTaskSubscription();
    this.destroyDialogOutputEventsSubscription();
    this.destroyTodaysTaskListSubscription();
    this.destroyUpdateTaskSubscription();
    this.destroyRefreshDataSubscription();
  }

  getTodaysTaskList(): void {
    this.isTodaysTaskListLoading = true;
    this.todaysTaskListSubscription = this.taskService.getTodaysTaskList(this.pageSize, this.pageNumber)
      .subscribe({
        next: (response: HttpResponse<TaskModel[]>) => this.handleTodaysTaskListResponse(response),
        error: (error) => { console.log(error); }
      });
  }

  listenDataRefreshSubject(): void {
    this.refreshDataSubscription = this.data.$refreshDataSubject?.subscribe((isRefreshData) => {
      isRefreshData ? this.getTodaysTaskList() : this.getTaskList();
    });
  }

  getTaskList(): void {
    this.isTodaysTaskListLoading = true;
    this.todaysTaskListSubscription = this.taskService.getTaskList(this.pageSize, this.pageNumber, this.taskStatus)
      .subscribe({
        next: (response: HttpResponse<TaskModel[]>) => this.handleTodaysTaskListResponse(response),
        error: (error) => { console.log(error); }
      });
  }

  handleTodaysTaskListResponse(response: HttpResponse<TaskModel[]>): void {
    this.totalRecords = PaginationUtil.getTotalRecords(response.headers);
    const todaysTaskList = response.body as TaskModel[];
    this.dataSource = todaysTaskList;
    this.isTodaysTaskListLoading = false;
  }


  handlePaginationEvent(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.data?.isTodaysTask) {
      this.getTodaysTaskList();
    } else {
      this.getTaskList();
    }
  }

  handleDeleteButtonEvent(rowData: TaskModel): void {
    this.dialogRef = this.dialog.open(DialogComponent, { width: '500px' });
    this.listenDialogCloseEvent(rowData);
  }

  listenDialogCloseEvent(rowData: TaskModel): void {
    this.dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.deleteTask(rowData.id);
      }
    });
  }

  handleEditButtonEvent(rowData: TaskModel): void {
    this.dialogRef = this.dialog.open(TaskFormComponent, { width: '500px', data: rowData });
    this.listenTaskFormEditEvent(rowData);
  }

  deleteTask(taskId: number): void {
    this.deleteTaskSubscription = this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        if (this.data.$refreshDataSubject) {
          this.data?.$refreshDataSubject.next(true);
        } else {
          this.data.isTodaysTask ? this.getTodaysTaskList() : this.getTaskList();
        }
      }
    });
  }

  listenTaskFormEditEvent(rowData: TaskModel): void {
    this.destroyDialogOutputEventsSubscription();
    this.dialogComponentOutputEventSubscription = (this.dialogRef.componentInstance as TaskFormComponent).event.subscribe((data) => {
      this.handleTaskFormEvents(data, rowData);
    });
  }

  handleTaskFormEvents(event: TaskFormOutputEventModel, rowData: TaskModel): void {
    if (event.eventType === FormFooterActions.SUBMIT) {
      this.updateTask(event.data as FormGroup<TaskFormModel>, rowData);
    }
  }

  updateTask(taskForm: FormGroup<TaskFormModel>, rowData: TaskModel): void {
    this.destroyUpdateTaskSubscription();
    this.updateTaskSubscription = this.taskService.updateTask(taskForm, rowData)
      .subscribe({
        next: () => {
          this.handleTaskUpdateResponse();
        }
      });
  }

  handleTaskUpdateResponse(): void {
    this.dialogRef.close();
    this.data?.$refreshDataSubject?.next(true);
    this.data.isTodaysTask ? this.getTodaysTaskList() : this.getTaskList();
  }


  handleCreateTaskEvent() {
    this.dialogRef = this.dialog.open(TaskFormComponent, { width: '500px' });
    this.listenTaskCreateFormSubmit();
  }

  listenTaskCreateFormSubmit(): void {
    this.destroyDialogOutputEventsSubscription();
    this.dialogComponentOutputEventSubscription = (this.dialogRef.componentInstance as TaskFormComponent).event.subscribe((event) => {
      this.createTask(event.data as FormGroup<TaskFormModel>);
    });
  }

  createTask(taskForm: FormGroup<TaskFormModel>) {
    this.destroyCreateTaskSubscription();
    this.createTaskSubscription = this.taskService.createTask(taskForm).subscribe({
      next: () => {
        this.handleCreateTaskSuccessResponse();
      }
    });
  }

  handleCreateTaskSuccessResponse(): void {
    this.dialogRef?.close();
    this.data?.$refreshDataSubject?.next(true);
    this.data.isTodaysTask ? this.getTodaysTaskList() : this.getTaskList();
  }

  handleSelectionChangeEvent(event: MatSelectChange): void {
    this.taskStatus = event.value;
    this.data?.isTodaysTask ? this.getTodaysTaskList() : this.getTaskList();
  }


  getClass(taskStatus: TaskStatus): string {
    return TASK_STATUS_MAPPER[taskStatus].class;
  }

  getTaskDisplayName(taskStatus: TaskStatus): string {
    return TASK_STATUS_MAPPER[taskStatus].displayName;
  }

  destroyCreateTaskSubscription(): void {
    this.createTaskSubscription?.unsubscribe();
  }

  destroyUpdateTaskSubscription(): void {
    this.updateTaskSubscription?.unsubscribe();
  }

  destroyDeleteTaskSubscription(): void {
    this.deleteTaskSubscription?.unsubscribe();
  }

  destroyDialogOutputEventsSubscription(): void {
    this.dialogComponentOutputEventSubscription?.unsubscribe();
  }

  destroyTodaysTaskListSubscription(): void {
    this.todaysTaskListSubscription?.unsubscribe();
  }

  destroyRefreshDataSubscription(): void {
    this.refreshDataSubscription?.unsubscribe();
  }
}
