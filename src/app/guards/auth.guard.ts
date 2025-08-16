import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard: Checking authentication');
    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard: User is authenticated');
      return true;
    }

    console.log('AuthGuard: User is not authenticated, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}
