import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppAuthApiEndpoints } from '../../constants/api-constants';
import { SignupRequestModel } from '../../model/request/signup-request.model';
import { UserModel } from '../../model/response/user.model';
import { loginRequestModel } from '../../model/request/login-request.model';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private http: HttpClient) { }

  private _userDetails: UserModel;

  get userDetails(): UserModel {
    return this._userDetails;
  }

  set userDetails(userDetails: UserModel) {
    this._userDetails = userDetails;
  }

  signUp(form: FormGroup) {
    const requestBody = this.prepareSignUpRequestPayload(form);
    return this.http.post<UserModel>(AppAuthApiEndpoints.SIGN_UP, requestBody);
  }

  prepareSignUpRequestPayload(form: FormGroup): SignupRequestModel {
    const formValue = form.getRawValue();
    const signUpRequestBody: SignupRequestModel = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password
    };
    return signUpRequestBody;
  }

  login(form: FormGroup) {
    const requestBody = this.prepareLoginRequestPayload(form);
    return this.http.post(AppAuthApiEndpoints.LOGIN, requestBody, { responseType: 'text', observe: 'response', withCredentials: true });
  }

  prepareLoginRequestPayload(form: FormGroup): loginRequestModel {
    const formValue = form.getRawValue();
    const loginRequestBody: loginRequestModel = {
      email: formValue.email,
      password: formValue.password
    };
    return loginRequestBody;
  }

  getUser(): Observable<UserModel> {
    if (this._userDetails) {
      return of(this.userDetails);  // If the user details are already available, return them immediately
    } else {
      return this.http.get<UserModel>(AppAuthApiEndpoints.GET_USER, { withCredentials: true })
        .pipe(
          tap((response) => {
            this.userDetails = response;  // Cache the user details for future use
          })
        );
    }
  }

  refreshToken() {
    return this.http.get(AppAuthApiEndpoints.REFRESH, { withCredentials: true, responseType: 'text' });
  }

  logOut() {
    return this.http.delete(AppAuthApiEndpoints.LOG_OUT, { withCredentials: true, responseType: 'text' });
  }

  isLoggedIn(): Observable<boolean> {
    const refresh = document.cookie.includes("refreshToken");
    if (refresh) {
      return this.refreshToken().pipe(
        map(() => true),
        catchError(() => of(false))
      );
    } else {
      return of(false);
    }
  }
}
