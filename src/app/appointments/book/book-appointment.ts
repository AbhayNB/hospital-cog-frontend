import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentBookResponse } from '../../types/appointments.types';

@Component({
  standalone: true,
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css'],
  imports: [CommonModule, RouterLink],
})
export class BookAppointmentComponent {
  doctorId!: number;
  date = '';
  startTime = '';
  booking: AppointmentBookResponse | null = null;
  conflictMsg = '';
  waiting = false;

  constructor(private route: ActivatedRoute, private appt: AppointmentService) {
    const params = this.route.snapshot.paramMap;
    this.doctorId = Number(params.get('doctorId'));
    this.date = params.get('date') ?? '';
    this.startTime = params.get('startTime') ?? '';
  }

  get appointmentDateTime(): string {
    return `${this.date}T${this.startTime}`;
  }

  confirm(): void {
    this.waiting = true;
    this.appt
      .bookAppointment({
        doctorId: this.doctorId,
        appointmentDateTime: this.appointmentDateTime,
      })
      .subscribe({
        next: (res: AppointmentBookResponse) => {
          this.booking = res;
          this.conflictMsg = '';
          this.waiting = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.conflictMsg =
              err.error?.message ||
              'The selected slot is already booked. Would you like to join the waitlist for this day?';
          }
          this.waiting = false;
        },
      });
  }

  joinWaitlist(): void {
    const preferredDate = this.date;
    this.waiting = true;
    this.appt.joinWaitlist(this.doctorId, preferredDate).subscribe({
      next: (res: any) => {
        this.booking = { success: res.success, message: res.message };
        this.waiting = false;
      },
      error: () => {
        this.waiting = false;
      },
    });
  }
}