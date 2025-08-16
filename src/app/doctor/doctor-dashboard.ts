import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css'],
})
export class DoctorDashboardComponent implements OnInit {
  user: any = null;
  userProfile: any = null;
  stats = {
    todayAppointments: 0,
    totalPatients: 0,
    nextPatient: '--',
  };
  upcomingAppointments: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user && this.user.role === 'doctor') {
      this.doctorService.getDoctorProfile(this.user.id).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.fetchUpcomingAppointments();
        },
        error: (error) => {
          console.error('Error fetching doctor profile:', error);
        },
      });
    } else {
      this.userService.getProfile().subscribe({
        next: (profile) => {
          this.userProfile = profile;
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
        },
      });
    }
    // Fetch doctor stats here
  }

  fetchUpcomingAppointments() {
    if (!this.user || !this.user.id) return;
    this.doctorService.getUpcomingQueue(this.user.id).subscribe({
      next: (appointments) => {
        this.upcomingAppointments = appointments || [];
        this.stats.todayAppointments = this.upcomingAppointments.filter(a => this.isToday(a.date)).length;
        this.stats.nextPatient = this.upcomingAppointments.length > 0 ? this.upcomingAppointments[0].patientName : '--';
        this.stats.totalPatients = new Set(this.upcomingAppointments.map(a => a.patientId)).size;
      },
      error: (error) => {
        console.error('Error fetching upcoming appointments:', error);
      },
    });
  }

  isToday(dateStr: string): boolean {
    const today = new Date();
    const date = new Date(dateStr);
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  goToSchedule() {
    this.router.navigate(['/doctor/schedule']);
  }
  goToUpcoming() {
    this.router.navigate(['/doctor/upcoming']);
  }
  goToHistory() {
    this.router.navigate(['/doctor/history']);
  }

  goToUpdateProfile() {
    this.router.navigate(['/doctor/update-profile']);
  }

  goToWaitlist() {
    const doctorId = this.userProfile?.id || this.user?.id || 0;
    this.router.navigate([`/doctor/${doctorId}/waitlist`]);
  }
}