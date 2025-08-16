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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
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
          this.isAdmin = user?.role === 'ROLE_ADMIN';
          this.isDoctor = user?.role === 'ROLE_DOCTOR';
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
    this.isAdmin = user?.role === 'ROLE_ADMIN';
    this.isDoctor = user?.role === 'ROLE_DOCTOR';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}