import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../service/task-service/task.service';
import { TaskModel } from '../../model/response/task.model';
import { TaskFormV2Component } from '../task-form-v2/task-form-v2.component';
import { FormGroup } from '@angular/forms';
import { AlertService } from '../../service/alert-service/alert.service';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { TaskFormModel } from '../task-form-v2/model/task-form-model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [TaskFormV2Component],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent {


  task: TaskModel;
  isLoading: boolean = false;
  constructor (
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private taskService: TaskService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getParams();
  }
  getParams() {
    this.route.params.subscribe((param) => {
      this.getTaskById(param['id']);
    });
  }

  getTaskById(id: number) {
    this.taskService.getTaskById(id).subscribe((response) => {
      this.task = response;
    });
  }

  handleFormSubmit(taskForm: FormGroup<TaskFormModel>): void {
    this.isLoading = true;
    this.taskService.updateTask(taskForm, this.task).subscribe(
      {
        next: () => {
          this.isLoading = false;
          this.alertService.openToaster("Task Updated Successfully.");
          this.navigationService.navigate(['app', "tasks"]);
        },
        error: () => { this.alertService.openToaster("Task Update failed!"); }
      }

    );
  }
}
