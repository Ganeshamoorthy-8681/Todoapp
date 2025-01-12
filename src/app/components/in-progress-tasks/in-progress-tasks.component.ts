import { Component, ElementRef, ViewChild } from '@angular/core';
import { TaskModel } from '../../model/response/task.model';
import { TaskService } from '../../service/task-service/task.service';
import { PaginationUtil } from '../../util/Paginationutil';
import { PageHeaderModel } from '../page-header/model/page-header.model';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { TaskListV2Component } from '../task-list-v2/task-list-v2.component';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../service/alert-service/alert.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-in-progress-tasks',
  standalone: true,
  imports: [PageHeaderComponent, CategoryFilterComponent, TaskListV2Component, MatButtonModule],
  templateUrl: './in-progress-tasks.component.html',
  styleUrl: './in-progress-tasks.component.scss'
})
export class InProgressTasksComponent {
  inProgressTaskHeaderData: PageHeaderModel = {
    title: 'All Tasks',
    description: "No Tasks Found",
    isActionVisible: true
  };

  isLoading = false;
  isLoadMore: boolean = false;
  category: string;
  pageNumber = 0;
  pageSize = 10;
  totalRecords: number;
  inProgressTasks: TaskModel[];

  constructor (private taskService: TaskService, private alertService: AlertService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getInProgressTask();
  }

  getInProgressTask(): void {
    this.isLoading = true;
    this.taskService.getInProgressTasks(this.pageSize, this.pageNumber, this.category).subscribe(
      {
        next: (response) => this.handleTaskListResponse(response),
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
      this.inProgressTasks = newTasks;
    } else {
      // Concatenate tasks for subsequent pages
      this.pageNumber++;
      this.inProgressTasks = this.inProgressTasks.concat(newTasks);
    }
    this.isLoadMore = this.inProgressTasks.length < this.totalRecords;
  }

  handleCategoryFilterChange(category: string) {
    this.category = category;
    this.pageNumber = 0;
    this.getInProgressTask();
  }

  handleLoadMoreEvent(): void {
    this.pageNumber++;
    this.getInProgressTask();
  }
}
