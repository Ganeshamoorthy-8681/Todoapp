import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../service/task-service/task.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TaskCountByStatusModel } from '../../model/response/task-count-by-status.model';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../service/alert-service/alert.service';
import { AlertComponentModel } from '../alert/model/alert-model';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-task-count-by-status',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatProgressSpinnerModule, AlertComponent],
  templateUrl: './task-count-by-status.component.html',
  styleUrl: './task-count-by-status.component.scss'
})
export class TaskCountByStatusComponent implements OnInit, OnDestroy {

  @Input() $refreshDataSubject: BehaviorSubject<boolean>;

  @Input({ required: false }) className: string;

  taskCountByStatus: TaskCountByStatusModel | null;
  errorObject: AlertComponentModel;
  isLoading: boolean;

  private taskCountByStatusSubscription: Subscription;
  private refreshDataSubscription: Subscription;


  constructor (
    private taskService: TaskService,
    private alertService: AlertService
  ) { };

  ngOnInit(): void {
    this.getTaskCountByStatus();
    this.listenDataRefreshSubject();
  }

  ngOnDestroy(): void {
    this.destroyTaskCountByStatusSubscription();
  }


  getTaskCountByStatus(): void {
    this.isLoading = true;
    this.taskCountByStatusSubscription = this.taskService.getTaskCountByStatus()
      .subscribe({
        next: (taskCount) => this.handleTaskCountByStatus(taskCount),
        error: (err) => { this.errorObject = this.alertService.handleError(err); },
        complete: () => this.isLoading = false

      });
  }


  listenDataRefreshSubject(): void {
    this.destroyRefreshDataSubscription();
    this.refreshDataSubscription = this.$refreshDataSubject.subscribe((isRefreshData) => {
      isRefreshData ? this.getTaskCountByStatus() : null;
    });
  }

  handleTaskCountByStatus(taskCount: TaskCountByStatusModel): void {
    this.taskCountByStatus = taskCount;
  }

  destroyTaskCountByStatusSubscription(): void {
    this.taskCountByStatusSubscription?.unsubscribe();
  }

  destroyRefreshDataSubscription(): void {
    this.refreshDataSubscription?.unsubscribe();
  }

}
