import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TaskService } from '../../service/task.service';
import { Subscription, tap } from 'rxjs';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskModel } from '../../model/response/task.model';
import { TaskCardComponentModel } from '../task-card/model/task-card.model';
import { TaskCountByStatusModel } from '../../model/response/task-count-by-status.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { PaginationUtil } from '../../util/Paginationutil';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { DialogRef } from '@angular/cdk/dialog';
import { TaskComponent } from '../task/task.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    TaskCardComponent,
    DatePipe,
    JsonPipe,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  isRecentlyUpdatedTableLoading: boolean;
  isTodaysTaskListLoading: boolean;
  dialogRef: MatDialogRef<TaskFormComponent>;

  constructor (private taskService: TaskService, private dialog: MatDialog) { };

  recentlyUpdatedTablePageSize: number = 5;
  recentlyUpdatedTablePageNumber: number = 0;
  recentlyUpdatedTableTotalRecords: number;
  recentlyUpdatedTableDataSource: TaskModel[];

  pageSize: number = 10;
  totalRecords: number;
  pageNumber: number = 0;
  recentlyUpdatedTableDisplayedColumns = ["name", "status", "updatedAt"];
  displayedColumns = ["name", "description", "status", "dueDate", "updatedAt", "createdAt", "actions"];
  dataSource: TaskModel[];


  todaysTaskList: TaskModel[];
  taskCountByStatus: TaskCountByStatusModel;
  taskCardConfigs: TaskCardComponentModel[];

  private todaysTaskListSubscription!: Subscription;

  ngOnDestroy(): void {
    this.todaysTaskListSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getInitialData();
  }


  getInitialData(): void {
    this.getTodaysTaskList();
    this.getTaskCountByStatus();
    this.getRecentlyUpdatedTaskList();
  }

  getTodaysTaskList(): void {
    this.todaysTaskListSubscription = this.taskService.getTodaysTaskList(this.pageSize, this.pageNumber)
      .subscribe({
        next: (response: HttpResponse<TaskModel[]>) => this.handleTodaysTaskListResponse(response),
        error: (error) => { console.log(error); }
      });
  }

  handleTodaysTaskListResponse(response: HttpResponse<TaskModel[]>): void {
    this.totalRecords = PaginationUtil.getTotalRecords(response.headers);
    this.todaysTaskList = response.body as TaskModel[];
    this.dataSource = this.todaysTaskList;
    this.isTodaysTaskListLoading = false;
  }


  getTaskCountByStatus(): void {
    this.taskService.getTaskCountByStatus()
      .subscribe({
        next: (taskCount) => this.handleTaskCountByStatus(taskCount),
        error: (error) => console.log(error)
      });
  }


  handleTaskCountByStatus(taskCount: TaskCountByStatusModel): void {
    this.taskCountByStatus = taskCount;
  }


  getRecentlyUpdatedTaskList() {
    this.taskService.getRecentlyUpdatedTaskList(this.recentlyUpdatedTablePageSize, this.recentlyUpdatedTablePageNumber)
      .subscribe({
        next: (response) => this.handleRecentlyUpdatedTaskListResponse(response)
      });
  }

  handleRecentlyUpdatedTaskListResponse(recentlyUpdatedTaskListResponse: HttpResponse<TaskModel[]>) {
    this.recentlyUpdatedTableTotalRecords = PaginationUtil.getTotalRecords(recentlyUpdatedTaskListResponse.headers);
    this.isRecentlyUpdatedTableLoading = false;
    this.recentlyUpdatedTableDataSource = recentlyUpdatedTaskListResponse.body as TaskModel[];
  }

  handlePaginationEvent(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getTodaysTaskList();
  }

  handleRecentlyClosedTablePagination(event: PageEvent): void {
    this.recentlyUpdatedTablePageNumber = event.pageIndex;
    this.recentlyUpdatedTablePageSize = event.pageSize;
    this.getRecentlyUpdatedTaskList();
  }

  handleDeleteButtonEvent(rowData: TaskModel) {
    console.log(rowData);
  }

  handleEditButtonEvent(rowData: TaskModel) {
    this.dialogRef = this.dialog.open(TaskFormComponent, { width: '500px', data: rowData });
    
    this.dialogRef.componentInstance.event.subscribe((data) => {
      console.log(data);
      // this.dialogRef.
    });
  }
}
