import { TaskCategory } from "../../enum/task-category.model";

export const TASK_CATEGORY_MAPPER = {
  [TaskCategory.PERSONAL]: { text: "Personal", icon: "home", class: "personal-category" },
  [TaskCategory.WORK]: { text: "Work", icon: "work", class: "work-category" },
  [TaskCategory.EDUCATION]: { text: "Education", icon: "education", class: "education-category" },

};
