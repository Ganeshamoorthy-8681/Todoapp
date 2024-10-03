import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoAppApiEndpoints } from '../constants/api-constants';
import { HttpRequestHeader } from '../enum/headers.model';
import { PaginationUtil } from '../util/Paginationutil';
import { TaskModel } from '../model/response/task.model';
import { Observable } from 'rxjs';
import { TaskCountByStatusModel } from '../model/response/task-count-by-status.model';
import { TaskCreateRequestModel } from '../model/request/task-create-request.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor (private http: HttpClient) { }

  getTodaysTaskList(pageSize: number, pageNumber: number): Observable<HttpResponse<TaskModel[]>> {
    const url = TodoAppApiEndpoints.TASK_LIST;
    const contentRequestRange = PaginationUtil.getRequestRange(pageNumber, pageSize);
    const headers = new HttpHeaders().set(HttpRequestHeader.RANGE, contentRequestRange);
    return this.http.get<TaskModel[]>(url, {
      headers: headers,
      observe: "response",
      // params: { isTodayDue: true; }
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


  createTask(reqBody: TaskCreateRequestModel): Observable<TaskModel> {
    const url = TodoAppApiEndpoints.TASK_CREATE;
    return this.http.post<TaskModel>(url, reqBody);
  }


}
