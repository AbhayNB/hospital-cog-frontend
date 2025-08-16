import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  emailSent: boolean = false;
  message: string = '';
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email) {
      return;
    }

    this.isSubmitting = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.emailSent = true;
        this.message =
          response.message ||
          'Password reset link has been sent to your email.';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error requesting password reset:', error);
        // Still show success message for security reasons
        this.emailSent = true;
        this.message =
          'If an account with that email exists, a password reset link has been sent.';
        this.isSubmitting = false;
      },
    });
  }
}
