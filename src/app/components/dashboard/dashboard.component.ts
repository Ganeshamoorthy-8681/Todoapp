import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskCountByStatusComponent } from '../task-count-by-status/task-count-by-status.component';
import { RecentlyUpdatedTaskComponent } from '../recently-updated-task/recently-updated-task.component';
import { TaskListComponentModel } from '../task-list/model/task-list-component.model';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TaskCountByStatusComponent,
    RecentlyUpdatedTaskComponent,
    TaskListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  $refreshDataSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  taskListComponentData: TaskListComponentModel = {
    title: "My Today's Task",
    isFilterRequired: false,
    isTodaysTask: true,
    $refreshDataSubject: this.$refreshDataSubject
  };

}
