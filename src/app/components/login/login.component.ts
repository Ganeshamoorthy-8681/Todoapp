import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PasswordRegex } from '../../constants/Regex-constants';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service/auth.service';
import { AlertService } from '../../service/alert-service/alert.service';
import { UserModel } from '../../model/response/user.model';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { TaskService } from '../../service/task-service/task.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, flatMap } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIcon, MatButtonModule, ReactiveFormsModule, RouterLink, MatProgressBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;

  constructor (private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PasswordRegex)]]
    });
  }

  handleVisibilityIconEvent(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  handleSubmitEvent(): void {
    this.login();
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginForm).subscribe({
      next: (response) => this.handleLoginResponse(response.body as string),
      error: (error: HttpErrorResponse) => {
        let data;
        try {
          data = JSON.parse(error.error);
        }
        finally {
          this.isLoading = false;
          this.alertService.openToaster(data?.message ?? "Unable to login");
        }

      }
    });
  }

  handleLoginResponse(response: String) {
    this.alertService.openToaster("Login Successful");
    this.navigationService.navigate(["app", "tasks"]);
  }

  //Helper 
  getEmailErrorMessage(): String {
    const errors = this.loginForm.get("email")?.errors;
    const isTouched = this.loginForm.get("email")?.touched;
    if (!isTouched) return "";
    if (errors?.['required']) {
      return "Email is Required";
    } else if (errors?.['email']) {
      return "Email must be formatted";
    }
    else {
      return "";
    }
  }

  getPasswordErrorMessage(): string {
    const errors = this.loginForm.get("password")?.errors;
    const isTouched = this.loginForm.get("password")?.touched;
    if (!isTouched) return "";
    if (errors?.['required']) {
      return "Password is Required";
    } else if (errors?.['pattern']) {
      return "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
    } else {
      return "";
    }
  }
}
