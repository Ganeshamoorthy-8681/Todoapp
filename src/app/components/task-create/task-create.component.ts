import { Component } from '@angular/core';
import { TaskFormV2Component } from '../task-form-v2/task-form-v2.component';
import { TaskService } from '../../service/task-service/task.service';
import { FormGroup } from '@angular/forms';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { AlertService } from '../../service/alert-service/alert.service';
import { TaskFormModel } from '../task-form-v2/model/task-form-model';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [TaskFormV2Component],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent {

  isLoading: boolean;

  constructor (
    private taskService: TaskService,
    private navigationService: NavigationService,
    private alertService: AlertService
  ) { }

  handleFormSubmit(form: FormGroup<TaskFormModel>): void {
    this.isLoading = true;
    this.createTask(form);
  }

  createTask(form: FormGroup<TaskFormModel>): void {
    this.taskService.createTask(form).subscribe(
      {
        next: () => {
          this.isLoading = false;
          this.alertService.openToaster("Task Created SuccessFully.");
          this.navigationService.navigate(["app", "tasks", "all"]);
        },
        error: () => {
          this.alertService.openToaster("Unable to create Task!");
        }
      }
    );
  }
}
