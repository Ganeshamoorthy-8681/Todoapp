import { TaskStatus } from "../enum/task-status.model";

export interface TaskBaseModel {
  taskName: string;

  taskDescription: string;

  taskStatus: TaskStatus;

  dueDate: number;
}
