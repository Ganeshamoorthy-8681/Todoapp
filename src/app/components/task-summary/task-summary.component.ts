import { DatePipe, Location } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../service/task-service/task.service';
import { Subscription } from 'rxjs';
import { TaskModel } from '../../model/response/task.model';
import { TASK_CATEGORY_MAPPER } from '../../model/mapper/task-category-mapper';
import { TaskCategory } from '../../enum/task-category.model';
import { TASK_PRIORITY_MAPPER } from '../../model/mapper/task-priority-mapper';
import { MatChipsModule } from '@angular/material/chips';
import { TASK_STATUS_MAPPER } from '../../model/mapper/task-status-mapper';
import { AlertService } from '../../service/alert-service/alert.service';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-summary',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, DatePipe, MatChipsModule],
  templateUrl: './task-summary.component.html',
  styleUrl: './task-summary.component.scss'
})
export class TaskSummaryComponent {

  private dialogRef: MatDialogRef<DeleteTaskDialogComponent>;
  private dialogSubscription: Subscription;
  isLoading: boolean;
  taskSummary: TaskModel;
  routeSubscription: Subscription;


  constructor (
    private location: Location,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private dialog: MatDialog,
    private navigationService: NavigationService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getParams();
  }

  ngOnDestroy(): void {
    this.dialogSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }


  getParams(): void {
    this.routeSubscription = this.route.params.subscribe((param) => {
      this.getTaskById(param['id']);
    });
  }

  getTaskById(id: number): void {
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe(
      {
        next: (response) => {
          this.taskSummary = response;
          this.isLoading = false;
        },
        error: () => this.alertService.openToaster("Unable to fetch Task Details")
      }
    );
  }

  handleGoBackEvent(): void {
    this.location.back();
  }

  handleEditEvent() {
    this.navigationService.navigate(["app", "tasks", "edit", this.taskSummary.id.toString()]);
  }

  handleDeleteEvent() {
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
    this.taskService.deleteTask(this.taskSummary.id).subscribe({
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


  //Helper functions
  getCategoryIcon(): string {
    return TASK_CATEGORY_MAPPER[this.taskSummary.taskCategory as TaskCategory]?.icon;
  }
  getCategoryClassName(): string {
    return TASK_CATEGORY_MAPPER[this.taskSummary.taskCategory as TaskCategory]?.class;
  }
  getCategoryDisplayName(): string {
    return TASK_CATEGORY_MAPPER[this.taskSummary.taskCategory as TaskCategory]?.text;
  }

  getPriorityClass(): string {
    return TASK_PRIORITY_MAPPER[this.taskSummary.taskPriority].class;
  }

  getDisplayName(): string {
    return TASK_PRIORITY_MAPPER[this.taskSummary.taskPriority].displayName;
  }

  isTaskOverdue(): boolean {
    return this.taskSummary.dueDate < Date.now();
  }

  getStatusClassName(): string {
    return TASK_STATUS_MAPPER[this.taskSummary.taskStatus].class;
  }

  getStatusDisplayName(): string {
    return TASK_STATUS_MAPPER[this.taskSummary.taskStatus].displayName;
  }
}
