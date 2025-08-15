import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  resetComplete: boolean = false;
  error: boolean = false;
  message: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;
  passwordMismatch: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        this.error = true;
        this.errorMessage =
          'Invalid or missing reset token. Please request a new password reset link.';
      }
    });
  }

  onSubmit() {
    if (!this.token || !this.newPassword) {
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;
    this.isSubmitting = true;

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.resetComplete = true;
        this.message =
          response.message ||
          'Your password has been reset successfully. You can now log in with your new password.';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.error = true;
        this.errorMessage =
          error.error?.message ||
          'An error occurred while resetting your password. The token may be invalid or expired.';
        this.isSubmitting = false;
      },
    });
  }
}
