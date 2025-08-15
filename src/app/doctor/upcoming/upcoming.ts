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
    const me = this.auth.getCurrentUser(); if (!me?.id) return;
    this.loading = true; this.message = '';
    this.doctor.getUpcomingQueue(me.id).subscribe({
      next: (res) => { this.items = res || []; this.loading = false; },
      error: () => { this.message = 'Failed to load upcoming appointments.'; this.loading = false; },
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