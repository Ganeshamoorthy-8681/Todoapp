import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoAppApiEndpoints } from '../../constants/api-constants';
import { HttpRequestHeader } from '../../enum/headers.model';
import { PaginationUtil } from '../../util/Paginationutil';
import { TaskModel } from '../../model/response/task.model';
import { Observable, switchMap, tap } from 'rxjs';
import { TaskCountByStatusModel } from '../../model/response/task-count-by-status.model';
import { TaskCreateRequestModel } from '../../model/request/task-create-request.model';
// import { TaskFormModel } from '../../components/task-form/task-form.model';
import { TaskUpdateRequestModel } from '../../model/request/task-update-request.model';
import { FormGroup } from '@angular/forms';
import { UrlUtil } from '../../util/UrlUtil';
import { TaskStatus } from '../../enum/task-status.model';
import { TaskCategory } from '../../enum/task-category.model';
import { TaskFormModel } from '../../components/task-form-v2/model/task-form-model';
import { AuthService } from '../auth-service/auth.service';
import { UserModel } from '../../model/response/user.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor (
    private http: HttpClient,
    private authService: AuthService
  ) { }


  getTodaysTaskList(pageSize: number, pageNumber: number): Observable<HttpResponse<TaskModel[]>> {
    const url = TodoAppApiEndpoints.TASK_LIST;
    const contentRequestRange = PaginationUtil.getRequestRange(pageNumber, pageSize);
    const headers = new HttpHeaders().set(HttpRequestHeader.RANGE, contentRequestRange);
    return this.http.get<TaskModel[]>(url, {
      headers: headers,
      observe: "response",
      params: { isTodayDue: true }
    });
  }

  getTaskList(pageSize: number, pageNumber: number, queryParam?: {}): Observable<HttpResponse<TaskModel[]>> {
    const url = TodoAppApiEndpoints.TASK_LIST;
    const contentRequestRange = PaginationUtil.getRequestRange(pageNumber, pageSize);
    const headers = new HttpHeaders().set(HttpRequestHeader.RANGE, contentRequestRange);

    return this.getUser().pipe(
      switchMap((response) => this.http.get<TaskModel[]>(
        UrlUtil.getRequiredUrl(url, { userId: response.id }),
        {
          headers,
          observe: "response",
          withCredentials: true,
          params: queryParam
        }))
    );
  }


  getUser(): Observable<UserModel> {
    return this.authService.getUser();
  }

  getTaskCountByStatus(): Observable<TaskCountByStatusModel> {
    const url = TodoAppApiEndpoints.TASK_COUNT_BY_STATUS;
    return this.getUser().pipe(
      switchMap((response) =>
        this.http.get<TaskCountByStatusModel>(UrlUtil.getRequiredUrl(url, { userId: response.id }), { withCredentials: true })
      )
    );
  }


  // getRecentlyUpdatedTaskList(pageSize: number, pageNumber: number): Observable<HttpResponse<TaskModel[]>> {
  //   const url = TodoAppApiEndpoints.TASK_LIST;
  //   const contentRequestRange = PaginationUtil.getRequestRange(pageNumber, pageSize);
  //   const headers = new HttpHeaders().set(HttpRequestHeader.RANGE, contentRequestRange);
  //   return this.http.get<TaskModel[]>(url, {
  //     headers: headers,
  //     observe: "response",
  //     params: { sortBy: "updatedOn", sortOrder: "DESC" }
  //   });
  // }


  createTask(taskForm: FormGroup<TaskFormModel>): Observable<TaskModel> {
    const reqBody = this.prepareTaskCreateRequestData(taskForm);
    const url = TodoAppApiEndpoints.TASK_CREATE;
    return this.getUser().pipe(
      switchMap((response) =>
        this.http.post<TaskModel>(UrlUtil.getRequiredUrl(url, { userId: response.id }), reqBody, { withCredentials: true })
      )
    );
  }

  prepareTaskCreateRequestData(taskForm: FormGroup<TaskFormModel>): TaskCreateRequestModel {
    const formValue = taskForm.getRawValue();
    const reqBody: TaskCreateRequestModel = {
      taskName: formValue.name as string,
      taskDescription: formValue.description,
      taskStatus: formValue.status,
      dueDate: formValue.dueDate?.getTime() ?? new Date().getTime(),
      taskPriority: formValue.priority,
      taskCategory: formValue.category
    };
    return reqBody;
  }

  updateTask(taskForm: FormGroup<TaskFormModel>, taskData: TaskModel): Observable<TaskModel> {
    const url = TodoAppApiEndpoints.TASK_EDIT;
    const reqBody = this.prepareTaskUpdateRequestData(taskForm, taskData);
    return this.getUser().pipe(
      switchMap((response) => {
        return this.http.put<TaskModel>(UrlUtil.getRequiredUrl(url, { userId: response.id }), reqBody, { withCredentials: true });
      })
    );
  }


  prepareTaskUpdateRequestData(taskForm: FormGroup<TaskFormModel>, taskData: TaskModel) {
    const formValue = taskForm.getRawValue();
    const reqBody: TaskUpdateRequestModel = {
      id: taskData.id,
      taskName: formValue?.name as string,
      taskDescription: formValue.description,
      createdOn: taskData.createdOn,
      taskStatus: formValue.status,
      taskPriority: formValue.priority,
      taskCategory: formValue.category,
      dueDate: formValue.dueDate?.getTime() ?? 0
    };
    return reqBody;
  }

  deleteTask(id: number): Observable<string> {
    const url = TodoAppApiEndpoints.TASK_DELETE;
    return this.getUser().pipe(
      switchMap((response) => {
        return this.http.delete(UrlUtil.getRequiredUrl(url,
          { id, userId: response.id }),
          { responseType: 'text', withCredentials: true });
      })
    );
  }

  getTaskById(id: number) {
    const url = TodoAppApiEndpoints.TASK_SUMMARY;
    return this.getUser().pipe(switchMap((response) => {
      return this.http.get<TaskModel>(UrlUtil.getRequiredUrl(url, { id: id, userId: response.id }), { withCredentials: true });
    }));
  }


  getUpcomingTasks(pageSize: number, pageNumber: number, category?: TaskCategory | string) {
    const queryParam = {
      taskStatus: TaskStatus.UPCOMING,
      category: category
    };
    if (!category || category == 'ALL') {
      delete queryParam.category;
    }

    return this.getTaskList(pageSize, pageNumber, queryParam);
  }


  getCompletedTasks(pageSize: number, pageNumber: number, category?: TaskCategory | string) {
    const queryParam = {
      taskStatus: TaskStatus.COMPLETED,
      category: category
    };
    if (!category || category == 'ALL') {
      delete queryParam.category;
    }

    return this.getTaskList(pageSize, pageNumber, queryParam);
  }

  getInProgressTasks(pageSize: number, pageNumber: number, category?: TaskCategory | string) {
    const queryParam = {
      taskStatus: TaskStatus.IN_PROGRESS,
      category: category
    };
    if (!category || category == 'ALL') {
      delete queryParam.category;
    }

    return this.getTaskList(pageSize, pageNumber, queryParam);
  }

  getAllTasks(pageSize: number, pageNumber: number, category?: TaskCategory | string) {
    const queryParam = {
      category: category
    };
    if (!category || category == 'ALL') {
      delete queryParam.category;
    }

    return this.getTaskList(pageSize, pageNumber, queryParam);
  }

  getTodayTasks(pageSize: number, pageNumber: number, category?: TaskCategory | string) {
    const queryParam = {
      category: category,
      isTodayDue: true
    };
    if (!category || category == 'ALL') {
      delete queryParam.category;
    }

    return this.getTaskList(pageSize, pageNumber, queryParam);
  }
}
