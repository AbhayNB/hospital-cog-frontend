import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorSearchResult } from '../../types/appointments.types';

@Component({
  standalone: true,
  selector: 'app-doctor-search',
  templateUrl: './doctor-search.html',
  styleUrls: ['./doctor-search.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DoctorSearchComponent implements OnInit {
  form: FormGroup;
  loading = false;
  results: DoctorSearchResult[] = [];
  infoMessage = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router
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
            }
          } else {
            this.results = [];
            this.infoMessage =
              res?.message || 'No doctors are available based on your criteria.';
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  waiting = false;
  bookSlot(doctorId: number, yyyyMmDd: string, startTime: string): void {
    this.router.navigate(['/book', doctorId, yyyyMmDd, startTime]);
  }

  joinWaitlist(doctorId: number, preferredDate: string): void {
    this.waiting = true;
    this.doctorService.joinWaitlist(doctorId, preferredDate).subscribe({
      next: (res: any) => {
        this.infoMessage = res.message || 'You have been added to the waitlist.';
        this.waiting = false;
      },
      error: () => {
        this.infoMessage = 'Failed to join waitlist.';
        this.waiting = false;
      }
    });
  }
}