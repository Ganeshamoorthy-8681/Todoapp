import { Component } from '@angular/core';
import { TaskListComponentModel } from '../task-list/model/task-list-component.model';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    TaskListComponent
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  taskListComponentData: TaskListComponentModel = {
    title: "My Task's",
    isFilterRequired: true,
    isTodaysTask: false,
  };
}
