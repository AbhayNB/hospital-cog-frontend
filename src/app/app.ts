import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationsComponent } from './shared/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NotificationsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  isDoctor = false;
  private authSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.checkAuthStatus();
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          const user = this.authService.getCurrentUser();
          console.log('App component - Current user:', user);
          
          // Enhanced role checking with detailed logging
          this.isAdmin = user?.role === 'ADMIN';
          this.isDoctor = user?.role === 'DOCTOR';
          
          console.log('App component - Role details:', { 
            userRole: user?.role,
            roleType: typeof user?.role,
            isAdmin: this.isAdmin, 
            isDoctor: this.isDoctor,
            doctorRoleCheck: user?.role === 'DOCTOR',
            adminRoleCheck: user?.role === 'ADMIN'
          });
          
          // Force refresh role flags if they don't match expected values
          if (user?.role === 'DOCTOR' && !this.isDoctor) {
            console.warn('Fixing doctor role flag mismatch');
            this.isDoctor = true;
          }
          if (user?.role === 'ADMIN' && !this.isAdmin) {
            console.warn('Fixing admin role flag mismatch');
            this.isAdmin = true;
          }
        } else {
          this.isAdmin = false;
          this.isDoctor = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    const user = this.authService.getCurrentUser();
    
    // Enhanced role checking with detailed logging
    this.isAdmin = user?.role === 'ADMIN';
    this.isDoctor = user?.role === 'DOCTOR';
    
    console.log('checkAuthStatus - Role details:', { 
      userRole: user?.role,
      isAdmin: this.isAdmin, 
      isDoctor: this.isDoctor
    });
    
    // Force refresh role flags if they don't match expected values
    if (user?.role === 'DOCTOR' && !this.isDoctor) {
      console.warn('checkAuthStatus - Fixing doctor role flag mismatch');
      this.isDoctor = true;
    }
    if (user?.role === 'ADMIN' && !this.isAdmin) {
      console.warn('checkAuthStatus - Fixing admin role flag mismatch');
      this.isAdmin = true;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}