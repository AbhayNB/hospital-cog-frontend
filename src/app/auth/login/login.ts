import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  get credentials() {
    return {
      email: this.email,
      password: this.password,
    };
  }

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Attempting login with:', this.credentials);

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login response received:', response);

        if (response && response.accessToken) {
          console.log('Token received:', response.accessToken);
          
          // Try to decode token manually for debugging
          try {
            const tokenParts = response.accessToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Manual token decode - payload:', payload);
              console.log('Manual token decode - roles:', payload.roles || payload.authorities || 'No roles found');
            }
          } catch (e) {
            console.error('Error manually decoding token:', e);
          }
          
          // Debug: Check user role after login
          const user = this.authService.getCurrentUser();
          console.log('User after login:', user);
          console.log('User role:', user?.role);

          this.router
            .navigate(['/dashboard'])
            .then(() => {
              console.log('Navigation complete');
            })
            .catch((err) => {
              console.error('Navigation failed:', err);
            });
        } else {
          console.warn('No token in response:', response);
          alert('Login successful but no token received');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.error?.message === 'User is disabled') {
          alert(
            'Please verify your email before logging in. Check your inbox for the verification link.'
          );
        } else {
          alert('Login failed. Please check your credentials.');
        }
      },
      complete: () => {
        console.log('Login request completed');
      },
    });
  }
}
