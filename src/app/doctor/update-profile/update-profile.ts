
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.css']
})
export class UpdateProfileComponent {
  profile = {
    specialization: '',
    location: '',
    rating: ''
  };
  message = '';

  constructor(private doctorService: DoctorService, private authService: AuthService) {}

  onSubmit() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      this.message = 'User not found.';
      return;
    }
    this.doctorService.updateDoctorProfile(user.id, this.profile)
      .subscribe({
        next: () => {
          this.message = 'Profile updated successfully!';
        },
        error: (err: any) => {
          this.message = 'Failed to update profile.';
          console.error('Update profile error:', err);
        }
      });
  }
}
