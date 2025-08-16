import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, User } from '../types/auth.types';
import { environment } from '../../environments/environment';

type TokenPayload = {
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  id?: number;
  role?: string;  // 🔧 CHANGE 1: Added this line to support single role string
  roles?: string[];
  authorities?: string[];
  exp?: number; // seconds since epoch
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiUrl = environment.authBaseUrl;
  private currentUser: User | null = null;
  private authStateChanged = new BehaviorSubject<boolean>(false);

  authState$ = this.authStateChanged.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
    this.authStateChanged.next(this.isAuthenticated());
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      this.http.post<AuthResponse>(`${this.authApiUrl}/authenticate`, credentials).subscribe({
        next: (response) => {
          if (response && response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            this.loadCurrentUser();
            this.authStateChanged.next(true);
          }
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }

  register(userData: { email: string; password: string; fullName: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/register`, userData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/forgot-password?email=${encodeURIComponent(email)}`, {});
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/reset-password`, { token, newPassword });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.authStateChanged.next(false);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const { exp } = jwtDecode<{ exp?: number }>(token);
      if (exp && Date.now() >= exp * 1000) {
        // Expired token; clear it
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    // Try to get user from localStorage first
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.id) return user;
      } catch (e) {
        console.error('[AuthService] Failed to parse user from localStorage:', e);
      }
    }
    return this.currentUser;
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.currentUser = null;
      return;
    }
    try {
      const payload = jwtDecode<TokenPayload>(token);

      // If token expired, clear and exit
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.logout();
        return;
      }

      // 🔧 CHANGE 2: Updated to handle both single role string and role arrays
      // OLD: const rawRoles = payload.roles ?? payload.authorities ?? [];
      // NEW: This now checks for single 'role' first, then falls back to arrays
      const rawRoles = payload.role ? [payload.role] : payload.roles ?? payload.authorities ?? [];
      const normalizedRole =
        rawRoles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' :
        rawRoles.includes('ROLE_DOCTOR') ? 'ROLE_DOCTOR' :
        'ROLE_PATIENT';

      this.currentUser = {
        id: payload.id ?? 0,
        email: payload.email ?? '',
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        role: normalizedRole, // Default to ROLE_PATIENT if no roles found
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      this.currentUser = null;
    }
  }
}