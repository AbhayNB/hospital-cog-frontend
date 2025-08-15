import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, User } from '../types/auth.types';
import { environment } from '../../environments/environment';

type TokenPayload = {
  scope: any;
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  id?: number;
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

      // Enhanced debugging for token payload
      console.log('Full token payload:', payload);
      
      // Handle different role formats from backend
      let rawRoles = [];
      
      // Case 1: roles/authorities is an array
      if (Array.isArray(payload.roles)) {
        rawRoles = payload.roles;
      } else if (Array.isArray(payload.authorities)) {
        rawRoles = payload.authorities;
      }
      // Case 2: roles/authorities is a string
      else if (typeof payload.roles === 'string') {
        console.warn('Roles is a string instead of array:', payload.roles);
        rawRoles = [payload.roles];
      } else if (typeof payload.authorities === 'string') {
        console.warn('Authorities is a string instead of array:', payload.authorities);
        rawRoles = [payload.authorities];
      }
      // Case 3: roles might be in a different format (e.g., nested in scopes or other field)
      else if (payload.scope) {
        console.warn('Checking scope field for roles:', payload.scope);
        if (typeof payload.scope === 'string') {
          // Split scope string by spaces if it's space-delimited
          rawRoles = payload.scope.split(' ');
        } else if (Array.isArray(payload.scope)) {
          rawRoles = payload.scope;
        }
      }
      
      console.log('Processed token roles:', rawRoles);

      // More comprehensive role normalization
      let normalizedRole = 'PATIENT'; // Default role
      
      // Helper function to safely check role strings
      const hasRole = (roleArray: any[], roleType: string) => {
        if (!Array.isArray(roleArray) || roleArray.length === 0) return false;
        
        return roleArray.some(role => {
          if (!role) return false;
          
          // Handle string roles
          if (typeof role === 'string') {
            const upperRole = role.toUpperCase();
            return upperRole === roleType.toUpperCase() || 
                   upperRole === `ROLE_${roleType.toUpperCase()}` || 
                   upperRole.includes(roleType.toUpperCase());
          }
          
          // Handle object roles with authority property (Spring Security format)
          if (typeof role === 'object' && role.authority) {
            const upperAuthority = role.authority.toUpperCase();
            return upperAuthority === roleType.toUpperCase() || 
                   upperAuthority === `ROLE_${roleType.toUpperCase()}` || 
                   upperAuthority.includes(roleType.toUpperCase());
          }
          
          return false;
        });
      };
      
      // Check roles in priority order
      if (hasRole(rawRoles, 'ADMIN')) {
        normalizedRole = 'ADMIN';
      } else if (hasRole(rawRoles, 'DOCTOR')) {
        normalizedRole = 'DOCTOR';
      }
      
      // Additional debug for role detection using our hasRole function
      console.log('Role detection checks:', {
        hasAdminRole: hasRole(rawRoles, 'ADMIN'),
        hasDoctorRole: hasRole(rawRoles, 'DOCTOR'),
        hasPatientRole: hasRole(rawRoles, 'PATIENT'),
        rawRolesArray: Array.isArray(rawRoles),
        rawRolesLength: rawRoles.length,
        normalizedRole: normalizedRole
      });

      console.log('Normalized role:', normalizedRole);

      this.currentUser = {
        id: payload.id ?? 0,
        email: payload.email ?? '',
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        role: normalizedRole as "ADMIN" | "DOCTOR" | "PATIENT",
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      this.currentUser = null;
    }
  }
}