import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorSearchResult } from '../../types/appointments.types';
import { NotificationService } from '../../services/notification.service';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  standalone: true,
  selector: 'app-doctor-search',
  templateUrl: './doctor-search.html',
  styleUrls: ['./doctor-search.css'],
  imports: [CommonModule, ReactiveFormsModule, NotificationsComponent],
})
export class DoctorSearchComponent implements OnInit {
  form: FormGroup;
  loading = false;
  results: DoctorSearchResult[] = [];
  infoMessage = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      specialization: [''],
      location: [''],
      minRating: [''],
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    this.loading = true;
    this.infoMessage = '';
    this.notificationService.info('Searching for doctors...');
    const { specialization, location, minRating } = this.form.value as {
      specialization?: string;
      location?: string;
      minRating?: number | string;
    };

    this.doctorService
      .searchDoctors({
        specialization: specialization ?? undefined,
        location: location ?? undefined,
        minRating:
          minRating !== undefined && minRating !== null && String(minRating) !== ''
            ? Number(minRating)
            : undefined,
      })
      .subscribe({
        next: (res: any) => {
          if (Array.isArray(res)) {
            this.results = res;
            if (res.length === 0) {
              this.infoMessage =
                'No doctors are available based on your criteria.';
              this.notificationService.warning('No doctors found matching your criteria.');
            } else {
              this.notificationService.success(`Found ${res.length} doctors matching your criteria.`);
            }
          } else {
            this.results = [];
            this.infoMessage =
              res?.message || 'No doctors are available based on your criteria.';
            this.notificationService.warning(this.infoMessage);
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.notificationService.error('Error searching for doctors. Please try again.');
        },
      });
  }

  bookSlot(doctorId: number, yyyyMmDd: string, startTime: string): void {
    this.notificationService.info(`Navigating to booking page for selected slot on ${yyyyMmDd} at ${startTime}`);
    this.router.navigate(['/book', doctorId, yyyyMmDd, startTime]);
  }
}