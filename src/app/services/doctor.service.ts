// ...existing code...

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DoctorSearchResult } from '../types/appointments.types';
import {
  WeeklyAvailabilityRequestDto,
  SetAvailabilityResponseDto,
  UpcomingAppointmentDto,
  AppointmentActionResponseDto,
  AppointmentHistoryDto,
  ConsultationNoteDto,
  AddNoteResponseDto,
} from '../types/doctor.types';


@Injectable({ providedIn: 'root' })
export class DoctorService {
  getWaitlist(doctorId: number, date: string) {
    const params = new HttpParams().set('date', date);
    return this.http.get(`http://localhost:8080/api/doctors/${doctorId}/waitlist`, { params });
  }
  joinWaitlist(doctorId: number, preferredDate: string) {
    const params = new HttpParams().set('preferredDate', preferredDate);
    return this.http.post(`http://localhost:8080/api/doctors/${doctorId}/waitlist/join`, {}, { params });
  }
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  updateDoctorProfile(doctorId: number, profile: { specialization: string; location: string; rating: string }): Observable<string> {
    return this.http.put(`${this.apiUrl}/doctors/${doctorId}/profile`, profile, { responseType: 'text' });
  }

  // Patient search (already used)
  searchDoctors(params: { specialization?: string; location?: string; minRating?: number }): Observable<DoctorSearchResult[] | any> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, String(v));
    });
    return this.http.get<DoctorSearchResult[] | any>(`${this.apiUrl}/doctors/search`, { params: httpParams });
  }

  // Doctor features
  setWeeklyAvailability(doctorId: number, payload: WeeklyAvailabilityRequestDto): Observable<SetAvailabilityResponseDto> {
    return this.http.put<SetAvailabilityResponseDto>(`${this.apiUrl}/doctors/${doctorId}/availability`, payload);
  }

  getUpcomingQueue(doctorId: number): Observable<UpcomingAppointmentDto[]> {
    return this.http.get<UpcomingAppointmentDto[]>(`${this.apiUrl}/doctors/${doctorId}/appointments/upcoming`);
  }

  confirmAppointment(doctorId: number, appointmentId: number): Observable<AppointmentActionResponseDto> {
    return this.http.put<AppointmentActionResponseDto>(`${this.apiUrl}/doctors/${doctorId}/appointments/${appointmentId}/confirm`, {});
  }

  declineAppointment(doctorId: number, appointmentId: number): Observable<AppointmentActionResponseDto> {
    return this.http.put<AppointmentActionResponseDto>(`${this.apiUrl}/doctors/${doctorId}/appointments/${appointmentId}/decline`, {});
  }

  completeAppointment(doctorId: number, appointmentId: number): Observable<AppointmentActionResponseDto> {
    return this.http.put<AppointmentActionResponseDto>(`${this.apiUrl}/doctors/${doctorId}/appointments/${appointmentId}/complete`, {});
  }

  getHistory(doctorId: number, patientId?: number): Observable<AppointmentHistoryDto[]> {
    const params = patientId ? new HttpParams().set('patientId', String(patientId)) : undefined;
    return this.http.get<AppointmentHistoryDto[]>(`${this.apiUrl}/doctors/${doctorId}/appointments/history`, { params });
  }

  addConsultationNote(doctorId: number, appointmentId: number, note: ConsultationNoteDto): Observable<AddNoteResponseDto> {
    return this.http.post<AddNoteResponseDto>(`${this.apiUrl}/doctors/${doctorId}/appointments/${appointmentId}/notes`, note);
  }

  getDoctorProfile(doctorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doctors/${doctorId}/profile`);
  }
}