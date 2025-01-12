import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth-service/auth.service';
import { map, Observable, of } from 'rxjs';
import { NavigationService } from '../service/navigation-service/navigation-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuardService implements CanActivate {

  constructor (private authservice: AuthService, private navigationService: NavigationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authservice.isLoggedIn().pipe(map((isLoggedIn) => {
      if (isLoggedIn) {
        this.navigationService.navigate(["app", "tasks"]);
      }
      return !isLoggedIn;
    }));
  }
}
