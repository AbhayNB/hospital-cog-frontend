import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentHistoryDto } from '../../types/doctor.types';

@Component({
  standalone: true,
  selector: 'app-doctor-history',
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DoctorHistoryComponent {
  items: AppointmentHistoryDto[] = [];
  loading = false;
  message = '';

  filterForm: FormGroup;
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctor: DoctorService,
    private auth: AuthService
  ) {
    this.filterForm = this.fb.group({ patientId: [''] });
    this.noteForm = this.fb.group({
      appointmentId: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      prescription: ['', [Validators.required]],
      treatmentDetails: [''],
      remarks: [''],
    });
  }

  load(): void {
    const me = this.auth.getCurrentUser();
    if (!me?.id) return;
    const pid = this.filterForm.value.patientId
      ? Number(this.filterForm.value.patientId)
      : undefined;
    this.loading = true;
    this.message = '';
    this.doctor.getHistory(me.id, pid).subscribe({
      next: (res) => {
        this.items = res || [];
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load history.';
        this.loading = false;
      },
    });
  }

  addNote(): void {
    if (this.noteForm.invalid) return;
    const me = this.auth.getCurrentUser();
    if (!me?.id) return;
    const { appointmentId, ...note } = this.noteForm.value as any;
    this.doctor.addConsultationNote(me.id, Number(appointmentId), note).subscribe({
      next: () => {
        this.noteForm.reset();
        this.load();
      },
    });
  }
}