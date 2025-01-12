import { TaskStatus } from "../../enum/task-status.model";

export const TASK_STATUS_MAPPER = {
  [TaskStatus.COMPLETED]: { class: "completed", displayName: "Completed" },
  [TaskStatus.IN_PROGRESS]: { class: "in-progress", displayName: "In Progress" },
  [TaskStatus.UPCOMING]: { class: "upcoming", displayName: "Upcoming" }
};

