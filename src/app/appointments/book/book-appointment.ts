import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentBookResponse } from '../../types/appointments.types';
import { NotificationService } from '../../services/notification.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  standalone: true,
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css'],
  imports: [CommonModule, RouterLink, NotificationsComponent],
})
export class BookAppointmentComponent {
  doctorId!: number;
  date = '';
  startTime = '';
  booking: AppointmentBookResponse | null = null;
  conflictMsg = '';
  waiting = false;

  constructor(
    private route: ActivatedRoute, 
    private appt: AppointmentService,
    private notificationService: NotificationService
  ) {
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
    this.notificationService.info('Processing your appointment booking...');
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
          this.notificationService.success('Appointment booked successfully! A confirmation email has been sent.');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.conflictMsg =
              err.error?.message ||
              'The selected slot is already booked. Would you like to join the waitlist for this day?';
            this.notificationService.warning(this.conflictMsg);
          } else {
            this.notificationService.error('Failed to book appointment. Please try again.');
          }
          this.waiting = false;
        },
      });
  }

  joinWaitlist(): void {
    const preferredDate = this.date;
    this.waiting = true;
    this.notificationService.info('Adding you to the waitlist...');
    this.appt.joinWaitlist(this.doctorId, preferredDate).subscribe({
      next: (res: any) => {
        this.booking = { success: res.success, message: res.message };
        this.waiting = false;
        this.notificationService.success('Successfully added to the waitlist! You will be notified if a slot becomes available.');
      },
      error: (err) => {
        this.waiting = false;
        this.notificationService.error('Failed to join waitlist. Please try again.');
      },
    });
  }
}