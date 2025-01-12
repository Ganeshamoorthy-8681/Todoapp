import { Component, ElementRef, ViewChild } from '@angular/core';
import { CategoryFilterComponent } from "../category-filter/category-filter.component";
import { PageHeaderModel } from '../page-header/model/page-header.model';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { TaskModel } from '../../model/response/task.model';
import { TaskService } from '../../service/task-service/task.service';
import { TaskListV2Component } from '../task-list-v2/task-list-v2.component';
import { PaginationUtil } from '../../util/Paginationutil';
import { HttpResponse } from '@angular/common/http';
import { AlertService } from '../../service/alert-service/alert.service';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-upcoming-tasks',
  standalone: true,
  imports: [CategoryFilterComponent, PageHeaderComponent, TaskListV2Component],
  templateUrl: './upcoming-tasks.component.html',
  styleUrl: './upcoming-tasks.component.scss'
})
export class UpcomingTasksComponent {

  upcomingTaskPageHeader: PageHeaderModel = {
    title: 'Upcoming Tasks',
    description: 'No Upcoming Tasks Found',
    isActionVisible: true
  };

  isLoading = false;
  upcomingTasks: TaskModel[] = [];
  category: string;
  isLoadMore: boolean = false;
  pageNumber = 0;
  pageSize = 10;
  totalRecords: number;

  constructor (private taskService: TaskService, private alertService: AlertService) { }


  ngOnInit(): void {
    this.getUpcomingTasks();
  }

  getUpcomingTasks(): void {
    this.isLoading = true;
    this.taskService.getUpcomingTasks(this.pageSize, this.pageNumber, this.category).subscribe({
      next: (response) => this.handleTaskListResponse(response),
      error: () => this.alertService.openToaster("Something Went Wrong!.")
    });
  }

  handleTaskListResponse(response: HttpResponse<TaskModel[]>) {
    this.isLoading = false;
    this.totalRecords = PaginationUtil.getTotalRecords(response.headers);
    const newTasks = response.body as TaskModel[];
    if (this.pageNumber === 0) {
      // Reset tasks if it's the first page
      this.upcomingTasks = newTasks;
    } else {
      // Concatenate tasks for subsequent pages
      this.pageNumber++;
      this.upcomingTasks = this.upcomingTasks.concat(newTasks);
    }
    this.isLoadMore = this.upcomingTasks.length < this.totalRecords;

  }

  handleCategoryFilterChange(category: string) {
    this.category = category;
    this.pageNumber = 0;
    this.getUpcomingTasks();
  }

  handleLoadMoreEvent(): void {
    this.pageNumber++;
    this.getUpcomingTasks();
  }
}
