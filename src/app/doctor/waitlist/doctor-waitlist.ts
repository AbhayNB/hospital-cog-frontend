import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-waitlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-waitlist.html',
  styleUrls: ['./doctor-waitlist.css']
})
export class DoctorWaitlistComponent implements OnInit {
  doctorId!: number;
  date: string = '';
  waitlist: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(private route: ActivatedRoute, private doctorService: DoctorService) {}

  ngOnInit(): void {
    // Get doctorId from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.doctorId = user.id;
      } catch {
        this.doctorId = 0;
      }
    } else {
      this.doctorId = 0;
    }
    this.date = this.route.snapshot.queryParamMap.get('date') || this.getToday();
    this.fetchWaitlist();
  }

  getToday(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  fetchWaitlist(): void {
    this.loading = true;
    this.doctorService.getWaitlist(this.doctorId, this.date).subscribe({
      next: (res: any) => {
        this.waitlist = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to fetch waitlist.';
        this.loading = false;
      }
    });
  }
}
