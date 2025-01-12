import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../service/task-service/task.service';
import { TaskCountByStatusModel } from '../../model/response/task-count-by-status.model';
import { AlertService } from '../../service/alert-service/alert.service';

@Component({
  selector: 'app-task-count',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './task-count.component.html',
  styleUrl: './task-count.component.scss'
})
export class TaskCountComponent {

  isLoading = true;
  constructor (private taskService: TaskService, private alertService: AlertService) { }

  taskCount: TaskCountByStatusModel;
  ngOnInit(): void {
    this.getTaskCount();
  }
  getTaskCount(): void {
    // get task count
    this.taskService.getTaskCountByStatus().subscribe(
      {
        next: (response) => {
          this.taskCount = response;
          this.isLoading = false;
        },
        error: () => { this.alertService.openToaster("Unable to get the count."); }
      }
    );
  }
}
