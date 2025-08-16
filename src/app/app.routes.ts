import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PatientGuard } from './guards/patient.guard';
import { AdminGuard } from './guards/admin.guard';
import { DoctorGuard } from './guards/doctor.guard';
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'doctor-dashboard',
    loadComponent: () => import('./doctor/doctor-dashboard').then(m => m.DoctorDashboardComponent),
    // canActivate: [AuthGuard, DoctorGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  { path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.AdminComponent), canActivate: [AuthGuard, AdminGuard] },

  // Appointments (patient-only)
  {
    path: 'doctor-search',
    loadComponent: () =>
      import('./appointments/doctor-search').then(m => m.DoctorSearchComponent),
    // canActivate: [AuthGuard, PatientGuard],
  },
  {
    path: 'book/:doctorId/:date/:startTime',
    loadComponent: () =>
      import('./appointments/book').then(m => m.BookAppointmentComponent),
    canActivate: [AuthGuard, PatientGuard],
  },
  {
    path: 'my-appointments',
    loadComponent: () =>
      import('./appointments/my-appointments').then(m => m.MyAppointmentsComponent),
    // canActivate: [AuthGuard, PatientGuard],
  },
  {
    path: 'doctor/schedule',
    loadComponent: () =>
      import('./doctor/schedule/schedule').then(m => m.DoctorScheduleComponent),
    // canActivate: [AuthGuard, DoctorGuard],
  },
  {
    path: 'doctor/upcoming',
    loadComponent: () =>
      import('./doctor/upcoming/upcoming').then(m => m.DoctorUpcomingComponent),
    // canActivate: [AuthGuard, DoctorGuard],
  },
  {
    path: 'doctor/history',
    loadComponent: () =>
      import('./doctor/history/history').then(m => m.DoctorHistoryComponent),
    canActivate: [AuthGuard, DoctorGuard],
  },
  {
    path: 'doctor/waitlist',
    loadComponent: () => import('./doctor/waitlist/doctor-waitlist').then(m => m.DoctorWaitlistComponent),
    canActivate: [AuthGuard, DoctorGuard],
  },

  {
    path: 'doctor/update-profile',
    loadComponent: () =>
      import('./doctor/update-profile/update-profile').then(m => m.UpdateProfileComponent),
    canActivate: [AuthGuard, DoctorGuard],
  },

  { path: '**', redirectTo: '/dashboard' },
];