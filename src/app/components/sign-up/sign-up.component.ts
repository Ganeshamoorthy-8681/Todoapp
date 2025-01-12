import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PasswordRegex, UsernameRegex } from '../../constants/Regex-constants';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../service/auth-service/auth.service';
import { UserModel } from '../../model/response/user.model';
import { AlertService } from '../../service/alert-service/alert.service';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MatIconModule, RouterModule, ReactiveFormsModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signUpForm: FormGroup;
  isPasswordVisible: boolean = false;
  isLoading = false;

  constructor (
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private navigationService: NavigationService
  ) { }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(UsernameRegex)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PasswordRegex)]]
    });
  }

  handleVisibilityIconEvent(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  handleSubmitEvent(): void {
    this.isLoading = true;
    this.authService.signUp(this.signUpForm).subscribe({
      next: (response) => this.handleSignUpResponse(response),
      error: (error) => {
        this.isLoading = false;
        let data;
        try {
          data = JSON.parse(error.error);
        }
        finally {
          this.isLoading = false;
          this.alertService.openToaster(data?.message ?? "Unable to Create Account ");
        }
      }
    });
  }

  handleSignUpResponse(response: UserModel) {
    this.alertService.openToaster("Account Creation Successful");
    this.navigationService.navigate(["/"]);

  }

  //Helper 
  getEmailErrorMessage(): String {
    const errors = this.signUpForm.get("email")?.errors;
    const isTouched = this.signUpForm.get("email")?.touched;
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
    const errors = this.signUpForm.get("password")?.errors;
    const isTouched = this.signUpForm.get("password")?.touched;
    if (!isTouched) return "";
    if (errors?.['required']) {
      return "Password is Required";
    } else if (errors?.['pattern']) {
      return "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
    } else {
      return "";
    }
  }

  getUsernameErrorMessage(): string {
    const errors = this.signUpForm.get("username")?.errors;
    const isTouched = this.signUpForm.get("username")?.touched;
    if (!isTouched) return "";
    if (errors?.['required']) {
      return "Username is Required";
    } else if (errors?.['pattern']) {
      return "Username must be 1-20 characters and contain only letters and numbers.";
    } else {
      return "";
    }
  }
}
