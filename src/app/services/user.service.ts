import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/auth.types';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  roles: string[];
  enabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  // Add this method for doctors tab
  getAllDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/doctors`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, userData);
  }

  createDoctor(doctorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add-doctor`, doctorData);
  }

  addAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add-admin`, adminData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }

  updateProfile(userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, userData);
  }

  updateDoctorProfile(doctorId: number, doctorData: { specialization: string; location: string; rating: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/doctors/${doctorId}/profile`, doctorData);
  }

  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/users/change-password`,
      passwordData
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`);
  }

  blockUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users/${id}/block`, {});
  }

  unblockUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users/${id}/unblock`, {});
  }

  getDoctorSchedule(doctorId: number) {
  return this.http.get<any[]>(`${this.apiUrl}/admin/doctors/${doctorId}/schedule`);
}

getDoctorRatings(doctorId: number) {
  return this.http.get<any>(`${this.apiUrl}/admin/doctors/${doctorId}/feedback`);
}
sendAnnouncement(data: { subject: string; message: string }) {
  return this.http.post('http://localhost:8080/api/admin/announcements', data);
}
}