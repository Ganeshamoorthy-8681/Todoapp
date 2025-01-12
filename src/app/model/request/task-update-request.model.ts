import { TaskStatus } from "../../enum/task-status.model";
import { TaskModel } from "../response/task.model";
import { TaskBaseModel } from "../task-base-model";

export type TaskUpdateRequestModel = TaskBaseModel & {
  id: number;
  createdOn: number;
};
