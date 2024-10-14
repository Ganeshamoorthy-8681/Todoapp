import { TaskFormComponent } from "../components/task-form/task-form.component";
import { Subscription } from "rxjs";
import { TaskService } from "../service/task-service/task.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";
import { FormGroup } from "@angular/forms";
import { TaskFormModel } from "../components/task-form/task-form.model";
import { AlertService } from "../service/alert-service/alert.service";
import { AlertComponentModel } from "../components/alert/model/alert-model";

export abstract class AbstractCreateTask {

  protected abstract dialogRef: MatDialogRef<TaskFormComponent | DialogComponent>;
  protected abstract dialogComponentOutputEventSubscription: Subscription;
  protected abstract dialog: MatDialog;
  protected abstract taskService: TaskService;
  protected abstract alertService: AlertService;
  errorObject: AlertComponentModel;
  private createTaskSubscription: Subscription;


  protected abstract handleCreateTaskSuccessResponse(): void;
  protected abstract destroyDialogOutputEventsSubscription(): void;

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
      },
      error: (err) => { this.errorObject = this.alertService.handleError(err); }
    });
  }

  destroyCreateTaskSubscription(): void {
    this.createTaskSubscription?.unsubscribe();
  }
};
