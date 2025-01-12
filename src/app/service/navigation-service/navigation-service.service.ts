import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor (private router: Router) { }

  navigate(routeString: Array<string>, queryParams = {}): void {
    this.router.navigate(routeString, { queryParams: queryParams, queryParamsHandling:"merge" });
  }
}
