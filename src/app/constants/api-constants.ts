import { environment } from "../../environments/environment";

export class TodoAppApiEndpoints {
  static API_DOMAIN = environment.apiEndpoint;
  static API_BASE_PATH = TodoAppApiEndpoints.API_DOMAIN + 'api/app/user/:userId/task/';
  static TASK_SUMMARY = this.API_BASE_PATH + ':id';
  static TASK_CREATE = this.API_BASE_PATH + 'create';
  static TASK_EDIT = this.API_BASE_PATH + 'edit';
  static TASK_DELETE = this.API_BASE_PATH + 'delete/:id';
  static TASK_LIST = this.API_BASE_PATH + 'list';
  static TASK_SEARCH = this.API_BASE_PATH + 'search';
  static TASK_COUNT_BY_STATUS = this.API_BASE_PATH + 'countByStatus';
};


export class AppAuthApiEndpoints {
  static API_DOMAIN = environment.apiEndpoint;
  static API_BASE_PATH = AppAuthApiEndpoints.API_DOMAIN + "api/auth/";
  static SIGN_UP = AppAuthApiEndpoints.API_BASE_PATH + "signup";
  static REFRESH = AppAuthApiEndpoints.API_BASE_PATH + "refresh";
  static LOGIN = AppAuthApiEndpoints.API_BASE_PATH + "login";
  static LOG_OUT = AppAuthApiEndpoints.API_BASE_PATH + "logout";
  static GOOGLE_LOGIN = AppAuthApiEndpoints.API_BASE_PATH + "login-with-google";
  static FORGOT_PASSWORD = AppAuthApiEndpoints.API_BASE_PATH + "forgot-password";
  static GET_USER = AppAuthApiEndpoints.API_BASE_PATH + "user/whoami";
}
