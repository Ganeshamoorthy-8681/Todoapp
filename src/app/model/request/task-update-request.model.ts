import { TaskStatus } from "../../enum/task-status.model";

export interface TaskUpdateRequestModel {
  id: number;
  taskName: string;
  taskDescription: string;
  createdOn: number;
  taskStatus: TaskStatus;
  dueDate: number;
}
