import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { UpcomingAppointmentDto } from '../../types/doctor.types';

@Component({
  standalone: true,
  selector: 'app-doctor-upcoming',
  templateUrl: './upcoming.html',
  styleUrls: ['./upcoming.css'],
  imports: [CommonModule],
})
export class DoctorUpcomingComponent implements OnInit {
  items: UpcomingAppointmentDto[] = [];
  loading = false;
  message = '';

  constructor(private doctor: DoctorService, private auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
      const me = this.auth.getCurrentUser();
      console.log('[DoctorUpcomingComponent] Current user:', me);
      if (!me?.id) {
        console.warn('[DoctorUpcomingComponent] No user or user id found.');
        return;
      }
      this.loading = true;
      this.message = '';
      console.log('[DoctorUpcomingComponent] Loading upcoming appointments for doctor id:', me.id);
      this.doctor.getUpcomingQueue(me.id).subscribe({
        next: (res) => {
          console.log('[DoctorUpcomingComponent] API response:', res);
          this.items = res || [];
          this.loading = false;
          console.log('[DoctorUpcomingComponent] Items set:', this.items);
        },
        error: (err) => {
          console.error('[DoctorUpcomingComponent] Error loading upcoming appointments:', err);
          this.message = 'Failed to load upcoming appointments.';
          this.loading = false;
        },
        complete: () => {
          console.log('[DoctorUpcomingComponent] Load complete.');
        }
      });
  }

  confirm(apptId: number): void {
    const me = this.auth.getCurrentUser(); if (!me?.id) return;
    this.doctor.confirmAppointment(me.id, apptId).subscribe({ next: () => this.load() });
  }

  decline(apptId: number): void {
    const me = this.auth.getCurrentUser(); if (!me?.id) return;
    this.doctor.declineAppointment(me.id, apptId).subscribe({ next: () => this.load() });
  }

  complete(apptId: number): void {
    const me = this.auth.getCurrentUser(); if (!me?.id) return;
    this.doctor.completeAppointment(me.id, apptId).subscribe({ next: () => this.load() });
  }
}