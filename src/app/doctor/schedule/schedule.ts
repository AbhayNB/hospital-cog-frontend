import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { WeeklyAvailabilityRequestDto } from '../../types/doctor.types';

@Component({
  standalone: true,
  selector: 'app-doctor-schedule',
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DoctorScheduleComponent {
  form: FormGroup;
  saving = false;
  message = '';

  days: Array<{label: string; value: string}> = [
    { label: 'Monday', value: 'MONDAY' }, { label: 'Tuesday', value: 'TUESDAY' },
    { label: 'Wednesday', value: 'WEDNESDAY' }, { label: 'Thursday', value: 'THURSDAY' },
    { label: 'Friday', value: 'FRIDAY' }, { label: 'Saturday', value: 'SATURDAY' },
    { label: 'Sunday', value: 'SUNDAY' },
  ];

  constructor(private fb: FormBuilder, private doctor: DoctorService, private auth: AuthService) {
    this.form = this.fb.group({
      slotDurationInMinutes: [30, [Validators.required, Validators.min(10)]],
      availability: this.fb.array([]),
    });
  }

  get availability(): FormArray { return this.form.get('availability') as FormArray; }

  addRow(): void {
    this.availability.push(this.fb.group({
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required], // HTML <input type="time"> gives "HH:mm"
      endTime: ['', Validators.required],
    }));
  }

  removeRow(idx: number): void { this.availability.removeAt(idx); }

  toSecondsTime(hhmm: string): string { return hhmm?.length === 5 ? `${hhmm}:00` : hhmm; }

  onSubmit(): void {
    if (this.form.invalid) return;
    const me = this.auth.getCurrentUser();
    if (!me?.id) return;

    const payload: WeeklyAvailabilityRequestDto = {
      slotDurationInMinutes: this.form.value.slotDurationInMinutes,
      availability: (this.form.value.availability ?? []).map((row: any) => ({
        dayOfWeek: row.dayOfWeek,
        startTime: this.toSecondsTime(row.startTime),
        endTime: this.toSecondsTime(row.endTime),
      })),
    };

    this.saving = true;
    this.message = '';
    this.doctor.setWeeklyAvailability(me.id, payload).subscribe({
      next: (res) => { this.message = res.message || 'Availability updated.'; this.saving = false; },
      error: () => { this.message = 'Failed to update availability.'; this.saving = false; },
    });
  }
}