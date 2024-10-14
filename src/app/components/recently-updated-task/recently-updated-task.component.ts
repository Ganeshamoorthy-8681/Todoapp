import { DatePipe, NgClass } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { TaskModel } from '../../model/response/task.model';
import { TaskService } from '../../service/task-service/task.service';
import { PaginationUtil } from '../../util/Paginationutil';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, delay, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFormModel } from '../task-form/task-form.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { TaskStatus } from '../../enum/task-status.model';
import { TASK_STATUS_MAPPER } from '../../model/mapper/task-status-mapper';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponentModel } from '../alert/model/alert-model';
import { AlertService } from '../../service/alert-service/alert.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-recently-updated-task',
  standalone: true,
  imports: [MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    DatePipe,
    NgClass,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    AlertComponent
  ],
  templateUrl: './recently-updated-task.component.html',
  styleUrl: './recently-updated-task.component.scss'
})
export class RecentlyUpdatedTaskComponent implements OnInit, OnDestroy {

  @Input() $refreshDataSubject: BehaviorSubject<boolean>;


  private dialogRef: MatDialogRef<TaskFormComponent, DialogComponent>;
  isLoading = true;
  errorObject: AlertComponentModel;
  recentlyUpdatedTableDisplayedColumns = ["name", "status", "updatedAt"];
  recentlyUpdatedTablePageSize: number = 5;
  recentlyUpdatedTablePageNumber: number = 0;
  recentlyUpdatedTableTotalRecords: number;
  recentlyUpdatedTableDataSource: TaskModel[] = [];
  isRecentlyUpdatedTableLoading: boolean;

  private createTaskSubscription: Subscription;
  private refreshDataSubscription: Subscription;
  private recentlyUpdatedTaskSubscription: Subscription;
  private dialogComponentOutputEventSubscription: Subscription;

  constructor (
    private taskService: TaskService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { };

  ngOnInit(): void {
    this.getRecentlyUpdatedTaskList();
    this.listenDataRefreshSubject();
  }

  ngOnDestroy(): void {
    this.destroyRecentlyUpdatedTaskSubscription();
    this.destroyCreateTaskSubscription();
  }

  getRecentlyUpdatedTaskList(): void {
    this.isRecentlyUpdatedTableLoading = true;
    this.destroyRecentlyUpdatedTaskSubscription();
    this.recentlyUpdatedTaskSubscription = this.taskService.getRecentlyUpdatedTaskList(this.recentlyUpdatedTablePageSize, this.recentlyUpdatedTablePageNumber)
      .subscribe({
        next: (response) => this.handleRecentlyUpdatedTaskListResponse(response as HttpResponse<TaskModel[]>),
        error: (error) => { this.errorObject = this.alertService.handleError(error); },
        complete: (() => this.isLoading = false)
      });
  }

  listenDataRefreshSubject(): void {
    this.destroyRefreshDataSubscription();
    this.refreshDataSubscription = this.$refreshDataSubject.subscribe((isRefreshData) => {
      isRefreshData ? this.getRecentlyUpdatedTaskList() : null;
    });
  }

  handleRecentlyUpdatedTaskListResponse(recentlyUpdatedTaskListResponse: HttpResponse<TaskModel[]>): void {
    this.isRecentlyUpdatedTableLoading = false;
    this.recentlyUpdatedTableTotalRecords = PaginationUtil.getTotalRecords(recentlyUpdatedTaskListResponse.headers);
    this.recentlyUpdatedTableDataSource = recentlyUpdatedTaskListResponse.body as TaskModel[];
  }

  handleRecentlyUpdatedTablePagination(event: PageEvent): void {
    this.recentlyUpdatedTablePageNumber = event.pageIndex;
    this.recentlyUpdatedTablePageSize = event.pageSize;
    this.getRecentlyUpdatedTaskList();
  }


  handleCreateTaskEvent(): void {
    this.dialogRef = this.dialog.open(TaskFormComponent, { width: '500px' });
    this.listenTaskCreateFormSubmit();
  }

  listenTaskCreateFormSubmit(): void {
    this.destroyDialogOutputEventsSubscription();
    this.dialogComponentOutputEventSubscription = (this.dialogRef.componentInstance as TaskFormComponent).event.subscribe((event) => {
      this.createTask(event.data as FormGroup<TaskFormModel>);
    });
  }

  createTask(taskForm: FormGroup<TaskFormModel>): void {
    this.destroyCreateTaskSubscription();
    this.createTaskSubscription = this.taskService.createTask(taskForm).subscribe({
      next: () => {
        this.handleCreateTaskSuccessResponse();
      }
    });
  }

  getClass(taskStatus: TaskStatus): string {
    return TASK_STATUS_MAPPER[taskStatus].class;
  }

  getTaskDisplayName(taskStatus: TaskStatus): string {
    return TASK_STATUS_MAPPER[taskStatus].displayName;
  }

  handleCreateTaskSuccessResponse(): void {
    this.dialogRef?.close();
    this.$refreshDataSubject.next(true);
  }

  destroyRecentlyUpdatedTaskSubscription(): void {
    this.recentlyUpdatedTaskSubscription?.unsubscribe();
  }

  destroyCreateTaskSubscription(): void {
    this.createTaskSubscription?.unsubscribe();
  }

  destroyDialogOutputEventsSubscription(): void {
    this.dialogComponentOutputEventSubscription?.unsubscribe();
  }

  destroyRefreshDataSubscription(): void {
    this.refreshDataSubscription?.unsubscribe();
  }

}
