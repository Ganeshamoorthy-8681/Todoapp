import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoAppApiEndpoints } from '../../constants/api-constants';
import { HttpRequestHeader } from '../../enum/headers.model';
import { PaginationUtil } from '../../util/Paginationutil';
import { TaskModel } from '../../model/response/task.model';
import { Observable } from 'rxjs';
import { TaskCountByStatusModel } from '../../model/response/task-count-by-status.model';
import { TaskCreateRequestModel } from '../../model/request/task-create-request.model';
import { TaskFormModel } from '../../components/task-form/task-form.model';
import { TaskUpdateRequestModel } from '../../model/request/task-update-request.model';
import { FormGroup } from '@angular/forms';
import { UrlUtil } from '../../util/UrlUtil';
import { TaskStatus } from '../../enum/task-status.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    responseType: 'text'
  };

  constructor (private http: HttpClient) { }


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

  getTaskList(pageSize: number, pageNumber: number, queryParam?: string): Observable<HttpResponse<TaskModel[]>> {
    const url = TodoAppApiEndpoints.TASK_LIST;
    const contentRequestRange = PaginationUtil.getRequestRange(pageNumber, pageSize);
    const headers = new HttpHeaders().set(HttpRequestHeader.RANGE, contentRequestRange);
    return this.http.get<TaskModel[]>(url, {
      headers: headers,
      observe: "response",
      params: queryParam && queryParam !== 'all' ? { taskStatus: queryParam } : {}
    });
  }

  getTaskCountByStatus(): Observable<TaskCountByStatusModel> {
    const url = TodoAppApiEndpoints.TASK_COUNT_BY_STATUS;
    return this.http.get<TaskCountByStatusModel>(url);
  }


  getRecentlyUpdatedTaskList(pageSize: number, pageNumber: number): Observable<HttpResponse<TaskModel[]>> {
    const url = TodoAppApiEndpoints.TASK_LIST;
    const contentRequestRange = PaginationUtil.getRequestRange(pageNumber, pageSize);
    const headers = new HttpHeaders().set(HttpRequestHeader.RANGE, contentRequestRange);
    return this.http.get<TaskModel[]>(url, {
      headers: headers,
      observe: "response",
      params: { sortBy: "updatedOn", sortOrder: "DESC" }
    });
  }


  createTask(taskForm: FormGroup<TaskFormModel>): Observable<TaskModel> {
    const reqBody = this.prepareTaskCreateRequestData(taskForm);
    const url = TodoAppApiEndpoints.TASK_CREATE;
    return this.http.post<TaskModel>(url, reqBody);
  }

  prepareTaskCreateRequestData(taskForm: FormGroup<TaskFormModel>): TaskCreateRequestModel {
    const formValue = taskForm.getRawValue();
    const reqBody: TaskCreateRequestModel = {
      taskName: formValue.name as string,
      taskDescription: formValue.description,
      taskStatus: formValue.status,
      dueDate: formValue.dueDate?.getTime() ?? new Date().getTime()
    };
    return reqBody;
  }

  updateTask(taskForm: FormGroup<TaskFormModel>, taskData: TaskModel): Observable<TaskModel> {
    const url = TodoAppApiEndpoints.TASK_EDIT;
    const reqBody = this.prepareTaskUpdateRequestData(taskForm, taskData);
    return this.http.put<TaskModel>(url, reqBody);
  }


  prepareTaskUpdateRequestData(taskForm: FormGroup<TaskFormModel>, taskData: TaskModel) {
    const formValue = taskForm.getRawValue();
    const reqBody: TaskUpdateRequestModel = {
      id: taskData.id,
      taskName: formValue?.name as string,
      taskDescription: formValue.description,
      createdOn: taskData.createdOn,
      taskStatus: formValue.status,
      dueDate: formValue.dueDate?.getTime() ?? 0
    };
    return reqBody;
  }

  deleteTask(id: number): Observable<string> {
    const url = TodoAppApiEndpoints.TASK_DELETE;
    return this.http.delete(UrlUtil.getRequiredUrl(url, { id }), { responseType: 'text' });
  }


}
