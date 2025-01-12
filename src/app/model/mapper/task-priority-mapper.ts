import { TaskPriority } from "../../enum/task-priority.model";

export const TASK_PRIORITY_MAPPER: {
  [k: string]: { class: string, displayName: string; };
} = {
  [TaskPriority.HIGH]: { class: "high", displayName: "High Priority" },
  [TaskPriority.MEDIUM]: { class: "medium", displayName: "Medium Priority"},
  [TaskPriority.LOW]: { class: "low", displayName: "Low Priority" }
};
