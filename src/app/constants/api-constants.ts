import { environment } from "../../environments/environment";

export class TodoAppApiEndpoints {
  static API_DOMAIN = environment.apiEndpoint;
  static API_BASE_PATH = TodoAppApiEndpoints.API_DOMAIN + 'api/task/';
  static TASK_CREATE = this.API_BASE_PATH + 'create';
  static TASK_EDIT = this.API_BASE_PATH + 'edit';
  static TASK_DELETE = this.API_BASE_PATH + 'delete/:id';
  static TASK_LIST = this.API_BASE_PATH + 'list';
  static TASK_COUNT_BY_STATUS = this.API_BASE_PATH + 'countByStatus';
};
