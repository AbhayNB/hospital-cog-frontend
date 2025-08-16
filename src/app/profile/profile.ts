import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth.types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  userData: User = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    role: 'ROLE_PATIENT',
  };
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  profileForm: FormGroup;
  updateSuccess = false;
  updateError = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userData = { ...currentUser };
    }
  }

  updateProfile() {
    // TODO: Implement profile update
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    // TODO: Implement password change
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.userService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.updateSuccess = true;
          this.updateError = '';
        },
        error: (error) => {
          this.updateSuccess = false;
          this.updateError = error.error.message || 'Failed to update profile';
        },
      });
    }
  }
}
