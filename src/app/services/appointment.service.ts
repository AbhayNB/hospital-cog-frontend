import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import {
  AppointmentRequestDto,
  AppointmentBookResponse,
  ApiMessageResponse,
  AppointmentDetails,
  WaitlistJoinResponse,
} from '../types/appointments.types';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getMyAppointments(): Observable<AppointmentDetails[]> {
    return this.http.get<AppointmentDetails[]>(
      `${this.apiUrl}/appointments/my-appointments`
    );
  }

  bookAppointment(payload: AppointmentRequestDto): Observable<AppointmentBookResponse> {
    return this.http.post<AppointmentBookResponse>(`${this.apiUrl}/appointments/book`, payload)
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationService.success('Appointment booked successfully. A confirmation email has been sent.');
          } else if (response.waitlistAvailable) {
            this.notificationService.info('The selected time slot is not available. You can join the waitlist.');
          }
        })
      );
  }

  cancelAppointment(appointmentId: number): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(`${this.apiUrl}/appointments/${appointmentId}/cancel`, {})
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationService.success('Appointment cancelled successfully. A confirmation email has been sent.');
          }
        })
      );
  }

  rescheduleAppointment(appointmentId: number, newAppointmentDateTime: string): Observable<AppointmentDetails> {
    return this.http.put<AppointmentDetails>(`${this.apiUrl}/appointments/${appointmentId}/reschedule`, {
      newAppointmentDateTime,
    })
    .pipe(
      tap(response => {
        this.notificationService.success('Appointment rescheduled successfully. A confirmation email has been sent.');
      })
    );
  }

  joinWaitlist(doctorId: number, preferredDate: string): Observable<WaitlistJoinResponse> {
    const params = new HttpParams().set('preferredDate', preferredDate);
    return this.http.post<WaitlistJoinResponse>(
      `${this.apiUrl}/doctors/${doctorId}/waitlist/join`,
      {},
      { params }
    )
    .pipe(
      tap(response => {
        this.notificationService.success('You have been added to the waitlist. You will be notified when a slot becomes available.');
      })
    );
  }
}