import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginType: 'customer' | 'admin' = 'customer';
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  switchLoginType(type: 'customer' | 'admin'): void {
    this.loginType = type;
    this.error = '';
    this.email = '';
    this.password = '';
  }

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter both Email and Password';
      return;
    }

    // Validate email format
    if (!this.email.toLowerCase().endsWith('@bestbank.com')) {
      this.error = 'Email must end with @bestbank.com';
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.loginType === 'customer') {
      this.authService.customerLogin(this.email, this.password).pipe(
        timeout(10000)
      ).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/']);
          } else {
            this.error = response.message || 'Login failed';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error:', err);
          // Handle different error structures
          if (err.name === 'TimeoutError') {
            this.error = 'Connection timeout. Please check if backend is running.';
          } else if (err.status === 401) {
            // Handle 401 Unauthorized - wrong credentials
            if (err.error && err.error.message) {
              this.error = err.error.message;
            } else {
              this.error = 'Invalid credentials. Please try again.';
            }
          } else if (err.error && typeof err.error === 'object' && err.error.message) {
            this.error = err.error.message;
          } else if (err.error && typeof err.error === 'string') {
            this.error = err.error;
          } else if (err.message) {
            this.error = err.message;
          } else {
            this.error = 'Login failed. Please try again.';
          }
        }
      });
    } else {
      this.authService.adminLogin(this.email, this.password).pipe(
        timeout(10000)
      ).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/']);
          } else {
            this.error = response.message || 'Login failed';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error:', err);
          // Handle different error structures
          if (err.name === 'TimeoutError') {
            this.error = 'Connection timeout. Please check if backend is running.';
          } else if (err.status === 401) {
            // Handle 401 Unauthorized - wrong credentials
            if (err.error && err.error.message) {
              this.error = err.error.message;
            } else {
              this.error = 'Invalid admin credentials. Please try again.';
            }
          } else if (err.error && typeof err.error === 'object' && err.error.message) {
            this.error = err.error.message;
          } else if (err.error && typeof err.error === 'string') {
            this.error = err.error;
          } else if (err.message) {
            this.error = err.message;
          } else {
            this.error = 'Login failed. Please try again.';
          }
        }
      });
    }
  }
}
