import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../types/auth.types';
import { UserProfile } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  userProfile: UserProfile | null = null;
  stats = {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    availableDoctors: 12,
    nextAppointment: '--',
    nextPatient: '--',
  };

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    // Fetch user profile
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      },
    });

    // Here you would typically fetch statistics and other data
    // based on the user's role
  }
}
