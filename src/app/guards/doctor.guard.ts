import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class DoctorGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.auth.getCurrentUser();
    console.log('DoctorGuard - Current user:', user);
    console.log('DoctorGuard - User role:', user?.role);
    
    // Enhanced role checking with detailed logging
    const isDoctor = user?.role === 'DOCTOR';
    console.log('DoctorGuard - Role check details:', {
      userRole: user?.role,
      roleType: typeof user?.role,
      doctorRoleCheck: user?.role === 'DOCTOR',
      isDoctor: isDoctor
    });
    
    if (!isDoctor) {
      console.log('DoctorGuard - Redirecting to dashboard (not a doctor)');
      return this.router.createUrlTree(['/dashboard']);
    }
    
    console.log('DoctorGuard - Access granted');
    return true;
  }
}