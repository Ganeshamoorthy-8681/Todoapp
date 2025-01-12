import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TodoAppApiEndpoints } from '../../constants/api-constants';
import { TaskModel } from '../../model/response/task.model';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { UrlUtil } from '../../util/UrlUtil';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchInputFormControl: FormControl;

  $closeOverlaySubject = new BehaviorSubject(false);

  constructor (private http: HttpClient, private authService: AuthService) {
  }

  getTaskBasedOnQuery(query: string) {
    const url = TodoAppApiEndpoints.TASK_SEARCH;
    return this.authService.getUser().pipe(switchMap((response) => {
      return this.http.get<Array<TaskModel>>(UrlUtil.getRequiredUrl(url, { userId: response.id }), { params: { query }, withCredentials: true });
    }));
  }
}
