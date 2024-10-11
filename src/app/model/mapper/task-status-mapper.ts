import { TaskStatus } from "../../enum/task-status.model";

export const TASK_STATUS_MAPPER = {
  [TaskStatus.COMPLETED]: { class: "completed", displayName: "COMPLETED" },
  [TaskStatus.IN_PROGRESS]: { class: "in-progress", displayName: "IN PROGRESS" },
  [TaskStatus.NOT_READY]: { class: "not-ready", displayName: "NOT READY" }
};

