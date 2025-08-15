import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<AppointmentDetails[]> {
    return this.http.get<AppointmentDetails[]>(
      `${this.apiUrl}/appointments/my-appointments`
    );
  }

  bookAppointment(payload: AppointmentRequestDto): Observable<AppointmentBookResponse> {
    return this.http.post<AppointmentBookResponse>(`${this.apiUrl}/appointments/book`, payload);
  }

  cancelAppointment(appointmentId: number): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(`${this.apiUrl}/appointments/${appointmentId}/cancel`, {});
  }

  rescheduleAppointment(appointmentId: number, newAppointmentDateTime: string): Observable<AppointmentDetails> {
    return this.http.put<AppointmentDetails>(`${this.apiUrl}/appointments/${appointmentId}/reschedule`, {
      newAppointmentDateTime,
    });
  }

  joinWaitlist(doctorId: number, preferredDate: string): Observable<WaitlistJoinResponse> {
    const params = new HttpParams().set('preferredDate', preferredDate);
    return this.http.post<WaitlistJoinResponse>(
      `${this.apiUrl}/doctors/${doctorId}/waitlist/join`,
      {},
      { params }
    );
  }
}