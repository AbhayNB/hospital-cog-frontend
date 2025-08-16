import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentDetails } from '../../types/appointments.types';

@Component({
  standalone: true,
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css'],
  imports: [CommonModule],
})
export class MyAppointmentsComponent implements OnInit {
  appointments: AppointmentDetails[] = [];
  loading = false;
  error = '';

  constructor(private appt: AppointmentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.appt.getMyAppointments().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.appointments = res;
          if (res.length === 0) this.error = 'No appointments found.';
        } else {
          this.appointments = [];
          this.error = res?.message || 'Failed to load appointments.';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load appointments.';
      },
    });
  }

  cancel(a: AppointmentDetails): void {
    this.appt.cancelAppointment(a.id).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  reschedule(a: AppointmentDetails, newDateTime: string): void {
    this.appt.rescheduleAppointment(a.id, newDateTime).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }
}