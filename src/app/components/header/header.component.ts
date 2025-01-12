import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { MatMenuModule } from '@angular/material/menu';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { AuthService } from '../../service/auth-service/auth.service';
import { AlertService } from '../../service/alert-service/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule, SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (
    private navigationService: NavigationService,
    private AuthService: AuthService,
    private alertService: AlertService
  ) { }

  handleSettingButtonClickEvent() {
    this.navigationService.navigate(["app", "tasks", "settings"]);
  }

  handleLogoutClickEvent() {
    this.logOut();
  }

  logOut() {
    this.AuthService.logOut().subscribe({
      next: () => this.handleLogoutResponse(),
      error: (error: HttpErrorResponse) => this.alertService.openToaster(error?.name ?? "Log out Failed")
    }
    );
  }

  handleLogoutResponse(): void {
    this.alertService.openToaster("LogOut Successful");
    this.navigationService.navigate(["/"]);
  }
}
