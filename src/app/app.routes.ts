import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/dashboard"
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "tasks",
    loadComponent: () => import("./components/task/task.component").then(m => m.TaskComponent)
  }
];
