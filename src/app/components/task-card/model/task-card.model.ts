import { TaskStatus } from "../../../enum/task-status.model";

export interface TaskCardComponentModel {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: number;
  updatedOn: number;
  createdDate: number;
}
