import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentDetails } from '../../types/appointments.types';
import { NotificationService } from '../../services/notification.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

// Extended interface to support UI state for appointments
interface AppointmentDetailsExtended extends AppointmentDetails {
  showReschedule?: boolean;
  rescheduling?: boolean;
  rescheduleSuccess?: boolean;
  rescheduleError?: string;
}

@Component({
  standalone: true,
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css'],
  imports: [CommonModule, NotificationsComponent],
})
export class MyAppointmentsComponent implements OnInit {
  appointments: AppointmentDetailsExtended[] = [];
  loading = false;
  error = '';

  constructor(
    private appt: AppointmentService,
    private notificationService: NotificationService
  ) {}

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
      next: (response) => {
        this.load();
        this.notificationService.success('Appointment cancelled successfully');
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to cancel appointment';
        this.notificationService.error(this.error);
      },
    });
  }

  showRescheduleForm(appointment: AppointmentDetailsExtended): void {
    // Reset all other appointment forms first
    this.appointments.forEach(a => {
      if (a.id !== appointment.id) {
        a.showReschedule = false;
      }
    });
    appointment.showReschedule = true;
  }

  hideRescheduleForm(appointment: AppointmentDetailsExtended): void {
    appointment.showReschedule = false;
  }

  reschedule(appointment: AppointmentDetailsExtended, newDateTime: string): void {
    if (!newDateTime) {
      appointment.rescheduleError = 'Please select a valid date and time';
      this.notificationService.warning('Please select a valid date and time');
      return;
    }

    appointment.rescheduling = true;
    appointment.rescheduleSuccess = false;
    appointment.rescheduleError = '';
    
    this.appt.rescheduleAppointment(appointment.id, newDateTime).subscribe({
      next: (updatedAppointment) => {
        appointment.rescheduling = false;
        appointment.rescheduleSuccess = true;
        appointment.showReschedule = false;
        
        // Update the appointment details with the new date
        appointment.appointmentDateTime = updatedAppointment.appointmentDateTime;
        
        // Show success notification
        this.notificationService.success('Appointment rescheduled successfully');
        
        // Show success message briefly, then hide it
        setTimeout(() => {
          appointment.rescheduleSuccess = false;
        }, 3000);
      },
      error: (err) => {
        appointment.rescheduling = false;
        const errorMsg = err.error?.message || 'Failed to reschedule appointment';
        appointment.rescheduleError = errorMsg;
        
        // Show error notification
        this.notificationService.error(errorMsg);
        
        // Hide error message after a delay
        setTimeout(() => {
          appointment.rescheduleError = '';
        }, 5000);
      },
    });
  }
}