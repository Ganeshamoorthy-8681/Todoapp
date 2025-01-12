import { Component, ElementRef, ViewChild } from '@angular/core';
import { PageHeaderModel } from '../page-header/model/page-header.model';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { TaskModel } from '../../model/response/task.model';
import { TaskService } from '../../service/task-service/task.service';
import { PaginationUtil } from '../../util/Paginationutil';
import { TaskListV2Component } from '../task-list-v2/task-list-v2.component';
import { AlertService } from '../../service/alert-service/alert.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [CategoryFilterComponent, PageHeaderComponent, TaskListV2Component],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.scss'
})
export class CompletedTasksComponent {
  completedTasksPageHeaderData: PageHeaderModel = {
    title: 'Upcoming Tasks',
    description: 'No Upcoming Tasks Found',
    isActionVisible: true
  };

  isLoading = false;
  completedTasks: TaskModel[];
  category: string;
  isLoadMore: boolean = false;
  pageNumber = 0;
  pageSize = 10;
  totalRecords: number;

  constructor (private taskService: TaskService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getCompletedTasks();
  }


  getCompletedTasks(): void {
    this.isLoading = true;
    this.taskService.getCompletedTasks(this.pageSize, this.pageNumber, this.category).subscribe(
      {
        next: (response => this.handleTaskListResponse(response)),
        error: () => this.alertService.openToaster("Something Went Wrong!")
      }

    );
  }

  handleTaskListResponse(response: HttpResponse<TaskModel[]>) {
    this.isLoading = false;
    this.totalRecords = PaginationUtil.getTotalRecords(response.headers);
    const newTasks = response.body as TaskModel[];
    if (this.pageNumber === 0) {
      // Reset tasks if it's the first page
      this.completedTasks = newTasks;
    } else {
      // Concatenate tasks for subsequent pages
      this.pageNumber++;
      this.completedTasks = this.completedTasks.concat(newTasks);
    }
    this.isLoadMore = this.completedTasks.length < this.totalRecords;
  }

  handleCategoryFilterChange(category: string) {
    this.category = category;
    this.pageNumber = 0;
    this.getCompletedTasks();
  }

  handleLoadMoreEvent(): void {
    this.pageNumber++;
    this.getCompletedTasks();
  }
}
