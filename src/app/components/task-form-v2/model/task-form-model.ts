import { FormControl, FormGroup } from "@angular/forms";
import { FormFooterActions } from "../../../enum/form-footer-actions.model";
import { TaskStatus } from "../../../enum/task-status.model";
import { TaskPriority } from "../../../enum/task-priority.model";
import { TaskCategory } from "../../../enum/task-category.model";

export interface TaskFormModel {
  name: FormControl<string | null>,
  description: FormControl<string>,
  dueDate: FormControl<Date | null>;
  status: FormControl<TaskStatus>;
  priority: FormControl<TaskPriority>;
  category: FormControl<TaskCategory>;
}



export interface TaskFormOutputEventModel {
  eventType: FormFooterActions,
  data: FormGroup<TaskFormModel> | null;
}
