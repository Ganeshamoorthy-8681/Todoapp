import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { NavigationService } from '../navigation-service/navigation-service.service';
import { AuthService } from '../auth-service/auth.service';

export const requestInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const navigationService = inject(NavigationService);
  const authService = inject(AuthService);
  return next(req)
    .pipe(
      catchError(
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                return next(req.clone());
              }),
              catchError((e) => {
                navigationService.navigate(["login"]);
                return throwError(() => e);
              })
            );
          }
          return throwError(() => error);
        }));
};
