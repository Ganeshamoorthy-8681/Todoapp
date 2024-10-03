import { TaskBaseModel } from "../task-base-model";

export interface TaskModel extends TaskBaseModel {
  id: number;

  createdOn: number;

  updatedOn: number;
}
