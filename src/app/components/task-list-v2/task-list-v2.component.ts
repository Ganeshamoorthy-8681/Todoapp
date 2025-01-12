import { Component, Input } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskModel } from '../../model/response/task.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';

@Component({
  selector: 'app-task-list-v2',
  standalone: true,
  imports: [TaskCardComponent, MatIcon, MatButtonModule],
  templateUrl: './task-list-v2.component.html',
  styleUrl: './task-list-v2.component.scss'
})
export class TaskListV2Component {
  @Input() tasks: TaskModel[] | null;
  @Input() isLoading: boolean = false;
  constructor (private navigationService: NavigationService) { }

  handleCreateTaskEvent() {
    this.navigationService.navigate(["app", "tasks", "create"]);
  }
}
