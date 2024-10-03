import { FormControl, FormGroup } from "@angular/forms";
import { FormFooterActions } from "../../enum/form-footer-actions.model";
import { TaskStatus } from "../../enum/task-status.model";

export interface TaskFormModel {
  name: FormControl<string | null>,
  description: FormControl<string>,
  dueDate: FormControl<Date | null>;
  status: FormControl<TaskStatus>;
}



export interface TaskFormOutputEventModel {
  eventType: FormFooterActions,
  data: FormGroup<TaskFormModel> | null;
}
