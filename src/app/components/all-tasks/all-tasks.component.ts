import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaskModel } from '../../model/response/task.model';
import { TaskService } from '../../service/task-service/task.service';
import { PaginationUtil } from '../../util/Paginationutil';
import { PageHeaderModel } from '../page-header/model/page-header.model';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { TaskListV2Component } from '../task-list-v2/task-list-v2.component';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { TaskCountComponent } from '../task-count/task-count.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../../service/alert-service/alert.service';
import { AuthService } from '../../service/auth-service/auth.service';
import { UserModel } from '../../model/response/user.model';
@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [PageHeaderComponent, TaskListV2Component, CategoryFilterComponent, TaskCountComponent, MatButtonModule],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {

  allTasksPageHeaderData: PageHeaderModel = {
    title: 'All Tasks',
    description: "No Tasks Found",
    isActionVisible: true
  };

  isLoading: boolean;
  category: string;
  pageNumber = 0;
  pageSize = 10;
  totalRecords: number;
  tasks: TaskModel[];
  isLoadMore: boolean = false;
  userDetails: UserModel;
  //Subscriptions
  private routeSubscription: Subscription;

  constructor (
    private taskService: TaskService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
    this.routeSubscription?.unsubscribe();
    this.routeSubscription = this.route.queryParams.subscribe((param) => {
      if (param['refresh']) {
        this.getAllTasks();
        this.navigationService.navigate(["app", "tasks"], { refresh: null });
      }
    });
  }



  handleUserResponse(response: UserModel) {
    this.userDetails = response;
    this.getAllTasks();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  getAllTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks(this.pageSize, this.pageNumber, this.category).subscribe({
      next: (response) => { this.handleTaskListSuccessResponse(response); },
      error: () => this.alertService.openToaster("Something Went Wrong!!")
    }
    );
  }

  handleTaskListSuccessResponse(response: HttpResponse<TaskModel[]>) {
    this.isLoading = false;
    this.totalRecords = PaginationUtil.getTotalRecords(response.headers);
    const newTasks = response.body as TaskModel[];
    if (this.pageNumber === 0) {
      // Reset tasks if it's the first page
      this.tasks = newTasks;
    } else {
      // Concatenate tasks for subsequent pages
      this.tasks = this.tasks.concat(newTasks);
    }
    this.isLoadMore = this.tasks.length < this.totalRecords;
  }


  handleCategoryFilterChange(category: string) {
    this.category = category;
    this.pageNumber = 0;
    this.getAllTasks();
  }

  handleLoadMoreEvent(): void {
    this.pageNumber++;
    this.getAllTasks();
  }
}
