import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, LoggedInUser } from '../../services/auth.service';

interface LoginResponse {
  success: boolean;
  message: string;
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  riskRating: string;
  kycStatus: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  errorMessage = '';
  loading = false;

  private apiUrl =
    'http://localhost:8082/sentinel/api/v1/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {

    if (!this.email || !this.email.includes('@')) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request = {
      email: this.email
    };
    this.loading = true;
    this.http.post<LoginResponse>(this.apiUrl, request)
      .subscribe({

        next: (response) => {

          this.loading = false;

          if (response.success) {

            const user: LoggedInUser = {
              customerId: response.customerId,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              riskRating: response.riskRating,
              kycStatus: response.kycStatus
            };

            // Store user only in BehaviorSubject
            this.authService.setUser(user);

            this.router.navigate(['/dashboard']);

          } else {

            this.errorMessage = response.message;
          }
        },

        error: (error) => {

          this.loading = false;

          if (error.status === 401) {
            this.errorMessage = 'Login Failed';
          } else {
            this.errorMessage =
              'Unable to connect to the server.';
          }
        }
      });
  }
}