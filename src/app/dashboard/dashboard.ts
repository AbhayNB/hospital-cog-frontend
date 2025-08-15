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
    console.log('Dashboard - Current user:', this.user);
    console.log('Dashboard - User role:', this.user?.role);
    
    // Additional debugging for role-based rendering
    console.log('Dashboard - Role conditions:', {
      isPatient: this.user?.role === 'PATIENT',
      isDoctor: this.user?.role === 'DOCTOR',
      isAdmin: this.user?.role === 'ADMIN',
      roleType: typeof this.user?.role,
      roleValue: this.user?.role
    });

    // Fetch user profile
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        console.log('Dashboard - User profile:', this.userProfile);
        console.log('Dashboard - Profile roles:', this.userProfile?.roles);
        
        // Check if backend roles match frontend role
        if (this.userProfile?.roles) {
          const backendRoles = this.userProfile.roles;
          console.log('Dashboard - Role comparison:', {
            frontendRole: this.user?.role,
            backendRoles: backendRoles,
            hasAdminRole: backendRoles.some(r => r === 'ROLE_ADMIN' || r === 'ADMIN'),
            hasDoctorRole: backendRoles.some(r => r === 'ROLE_DOCTOR' || r === 'DOCTOR'),
            hasPatientRole: backendRoles.some(r => r === 'ROLE_PATIENT' || r === 'PATIENT')
          });
        }
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      },
    });

    // Here you would typically fetch statistics and other data
    // based on the user's role
  }
}
