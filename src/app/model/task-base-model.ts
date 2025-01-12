import { TaskCategory } from "../enum/task-category.model";
import { TaskPriority } from "../enum/task-priority.model";
import { TaskStatus } from "../enum/task-status.model";

export interface TaskBaseModel {
  taskName: string;

  taskDescription: string;

  taskStatus: TaskStatus;

  dueDate: number;

  taskPriority: string;

  taskCategory: string;
}
