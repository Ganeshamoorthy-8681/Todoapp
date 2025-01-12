import { Routes } from '@angular/router';
import { IsLoggedInGuardService } from './guards/is-logged-in-guard.service';

export const routes: Routes = [
  {
    path: "",
    canActivate: [IsLoggedInGuardService],
    loadComponent: () => import("./components/login/login.component").then(m => m.LoginComponent)
  },
  {
    path: "login",
    canActivate: [IsLoggedInGuardService],
    loadComponent: () => import("./components/login/login.component").then(m => m.LoginComponent)
  },
  {
    path: "sign-up",
    loadComponent: () => import("./components/sign-up/sign-up.component").then(m => m.SignUpComponent)
  },
  {
    path: "app/tasks",
    loadComponent: () => import("./components/app-base/app-base.component").then(m => m.AppBaseComponent),
    children: [
      {
        path: "",
        redirectTo: "all",
        pathMatch: "full"
      },
      {
        path: "all",
        loadComponent: () => import("./components/all-tasks/all-tasks.component").then(m => m.AllTasksComponent)
      },
      {
        path: "today",
        loadComponent: () => import("./components/today-task/today-task.component").then(m => m.TodayTaskComponent),
      },
      {
        path: "upcoming",
        loadComponent: () => import("./components/upcoming-tasks/upcoming-tasks.component").then(m => m.UpcomingTasksComponent),
      },
      {
        path: "in-progress",
        loadComponent: () => import("./components/in-progress-tasks/in-progress-tasks.component").then(m => m.InProgressTasksComponent),
      },
      {
        path: "completed",
        loadComponent: () => import("./components/completed-tasks/completed-tasks.component").then(m => m.CompletedTasksComponent),
      },
      {
        path: "create",
        loadComponent: () => import("./components/task-create/task-create.component").then(m => m.TaskCreateComponent)
      },
      {
        path: "settings",
        loadComponent: () => import("./components/settings/settings.component").then(m => m.SettingsComponent)
      },
      {
        path: "edit/:id",
        loadComponent: () => import("./components/task-edit/task-edit.component").then(m => m.TaskEditComponent)
      },
      {
        path: ":id",
        loadComponent: () => import("./components/task-summary/task-summary.component").then(m => m.TaskSummaryComponent)
      },
    ]
  }
];
