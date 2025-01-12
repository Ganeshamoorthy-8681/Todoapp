import { Component, ElementRef, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { TaskListV2Component } from '../task-list-v2/task-list-v2.component';
import { PaginationUtil } from '../../util/Paginationutil';
import { TaskModel } from '../../model/response/task.model';
import { TaskService } from '../../service/task-service/task.service';
import { PageHeaderModel } from '../page-header/model/page-header.model';
import { HttpResponse } from '@angular/common/http';
import { AlertService } from '../../service/alert-service/alert.service';

@Component({
  selector: 'app-today-task',
  standalone: true,
  imports: [PageHeaderComponent, CategoryFilterComponent, TaskListV2Component],
  templateUrl: './today-task.component.html',
  styleUrl: './today-task.component.scss'
})
export class TodayTaskComponent {
  todayTasksPageHeaderData: PageHeaderModel = {
    title: 'Upcoming Tasks',
    description: 'No Upcoming Tasks Found',
    isActionVisible: true
  };

  isLoading = false;
  todayTasks: TaskModel[];
  category: string;
  isLoadMore: boolean = false;
  pageNumber = 0;
  pageSize = 10;
  totalRecords: number;

  constructor (private taskService: TaskService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getTodayTasks();
  }


  getTodayTasks(): void {
    this.isLoading = true;
    this.taskService.getTodayTasks(this.pageSize, this.pageNumber, this.category).subscribe(
      {
        next: (response) => this.handleTaskListResponse(response),
        error: () => this.alertService.openToaster("Something Went Wrong")
      }
    );
  }

  handleTaskListResponse(response: HttpResponse<TaskModel[]>) {
    this.isLoading = false;
    this.totalRecords = PaginationUtil.getTotalRecords(response.headers);
    const newTasks = response.body as TaskModel[];
    if (this.pageNumber === 0) {
      // Reset tasks if it's the first page
      this.todayTasks = newTasks;
    } else {
      // Concatenate tasks for subsequent pages
      this.pageNumber++;
      this.todayTasks = this.todayTasks.concat(newTasks);
    }
  this.isLoadMore = this.todayTasks.length < this.totalRecords;
  }

  handleCategoryFilterChange(category: string) {
    this.category = category;
    this.pageNumber = 0;
    this.getTodayTasks();
  }

  handleLoadMoreEvent(): void {
    this.pageNumber++;
    this.getTodayTasks();
  }
}
