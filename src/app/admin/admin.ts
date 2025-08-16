import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { AverageRatingPipe } from './average-rating.pipe';

interface ExtendedUser {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AverageRatingPipe],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  users: ExtendedUser[] = [];
  adminData = {
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    address: ''
  };
    // Utility to sanitize user object and remove deep recursion
    sanitizeUser(user: any): any {
      const sanitized = { ...user };
      if (Array.isArray(sanitized.availabilities)) {
        sanitized.availabilities = sanitized.availabilities.map((a: any) => {
          // Only keep doctor id and basic info, remove nested availabilities
          if (a.doctor) {
            a.doctor = {
              id: a.doctor.id,
              email: a.doctor.email,
              fullName: a.doctor.fullName,
              phoneNumber: a.doctor.phoneNumber,
              address: a.doctor.address,
              roles: a.doctor.roles,
              enabled: a.doctor.enabled,
              accountNonLocked: a.doctor.accountNonLocked,
              accountNonExpired: a.doctor.accountNonExpired,
              credentialsNonExpired: a.doctor.credentialsNonExpired,
              createdAt: a.doctor.createdAt,
              updatedAt: a.doctor.updatedAt,
              specialization: a.doctor.specialization,
              location: a.doctor.location,
              rating: a.doctor.rating,
              slotDurationInMinutes: a.doctor.slotDurationInMinutes
              // Do NOT include availabilities here
            };
          }
          return a;
        });
      }
      return sanitized;
    }
  searchTerm = '';
  filterRole = '';
  loading = false;
  editingUser: ExtendedUser | null = null;

  systemLogs: any[] = [];
  analytics: any = {};
  activeTab: string = 'dashboard';

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ROLE_PATIENT',
    phoneNumber: '',
    address: ''
  };

  doctors: ExtendedUser[] = [];
    blockUnblockUserId: number | null = null;
  doctorLoading = false;
  doctorSchedules: { [doctorId: number]: any[] } = {};
  doctorRatings: { [doctorId: number]: any[] } = {};

  constructor(
    private userService: UserService,
    private analyticsService: AdminAnalyticsService
  ) {}

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'doctors') {
      this.loadDoctors();
    }
  }

    blockUserById() {
      if (!this.blockUnblockUserId) {
        alert('Please enter a valid User ID');
        return;
      }
      this.userService.blockUser(this.blockUnblockUserId).subscribe({
        next: () => {
          this.loadUsers();
          alert('User blocked!');
        },
        error: (error) => {
          console.error('Error blocking user:', error);
          alert('Failed to block user');
        }
      });
    }

    unblockUserById() {
      if (!this.blockUnblockUserId) {
        alert('Please enter a valid User ID');
        return;
      }
      this.userService.unblockUser(this.blockUnblockUserId).subscribe({
        next: () => {
          this.loadUsers();
          alert('User unblocked!');
        },
        error: (error) => {
          console.error('Error unblocking user:', error);
          alert('Failed to unblock user');
        }
      });
    }

  get filteredUsers() {
    return this.users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.filterRole || user.role === this.filterRole;

      return matchesSearch && matchesRole;
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadSystemLogs();
    this.loadAnalytics();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        // Log raw backend response
        console.log('Raw backend response for users:', users);
        this.users = Array.isArray(users) ? users.map(user => {
          const sanitized = this.sanitizeUser(user);
          const nameParts = sanitized.fullName ? sanitized.fullName.split(' ') : [''];
          return {
            id: sanitized.id,
            email: sanitized.email,
            fullName: sanitized.fullName,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            role: sanitized.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' :
                  sanitized.roles.includes('ROLE_DOCTOR') ? 'ROLE_DOCTOR' : 'ROLE_PATIENT',
            enabled: sanitized.enabled
          };
        }) : [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        // Log raw error response if available
        if (error && error.error) {
          console.log('Raw backend error response:', error.error);
        }
        this.loading = false;
      }
    });
  }

  loadDoctors() {
    this.doctorLoading = true;
    this.userService.getAllDoctors().subscribe({
      next: (doctors: any[]) => {
        this.doctors = doctors.map(user => {
          const nameParts = user.fullName ? user.fullName.split(' ') : [''];
          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            role: 'DOCTOR',
            enabled: user.enabled
          };
        });
        this.doctorLoading = false;
      },
      error: () => {
        this.doctorLoading = false;
      }
    });
  }

  loadDoctorDetails(doctorId: number) {
    this.userService.getDoctorSchedule(doctorId).subscribe({
      next: (schedule) => {
        this.doctorSchedules[doctorId] = schedule;
      }
    });
    this.userService.getDoctorRatings(doctorId).subscribe({
      next: (ratings) => {
        this.doctorRatings[doctorId] = ratings;
      }
    });
  }

  loadSystemLogs() {
    this.analyticsService.getSystemLogs().subscribe({
      next: (logs: any[]) => {
        this.systemLogs = logs;
      },
      error: (error: any) => {
        console.error('Error loading logs:', error);
      }
    });
  }

  loadAnalytics() {
    this.analyticsService.getDashboardAnalytics().subscribe({
      next: (data: any) => {
        this.analytics = data;
      },
      error: (error: any) => {
        console.error('Error loading analytics:', error);
      }
    });
  }

  createUser() {
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email || !this.newUser.password) {
      alert('Please fill all fields');
      return;
    }

    const userData = {
      email: this.newUser.email,
      password: this.newUser.password,
      fullName: `${this.newUser.firstName} ${this.newUser.lastName}`,
      role: this.newUser.role
    };

    if (this.newUser.role === 'ROLE_DOCTOR' || this.newUser.role === 'DOCTOR') {
      this.userService.createDoctor(userData).subscribe({
        next: () => {
          alert('Doctor created successfully!');
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating doctor:', error);
          alert('Failed to create doctor');
        }
      });
    }
    if (this.newUser.role === 'ROLE_ADMIN' || this.newUser.role === 'ADMIN') {
      this.userService.addAdmin(userData).subscribe({
        next: () => {
          alert('Admin created successfully!');
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating admin:', error);
          alert('Failed to create admin');
        }
      });
    } 
  }

  resetForm() {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'ROLE_PATIENT',
      phoneNumber: '',
      address: ''
    };
  }

  editUser(user: ExtendedUser) {
    this.editingUser = { ...user };
  }

  saveUser() {
    if (!this.editingUser) return;

    const userData = {
      email: this.editingUser.email,
      password: '', // Leave empty unless updating password
      fullName: `${this.editingUser.firstName} ${this.editingUser.lastName}`,
      role: this.editingUser.role
    };

    this.userService.updateUser(this.editingUser.id, userData).subscribe({
      next: () => {
        this.loadUsers();
        this.cancelEdit();
        alert('User updated successfully!');
      },
      error: (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user');
      }
    });
  }

  cancelEdit() {
    this.editingUser = null;
  }

  deleteUser(user: ExtendedUser) {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          alert('User deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      });
    }
  }

  blockUser(user: ExtendedUser) {
    this.userService.blockUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        alert('User blocked!');
      },
      error: (error) => {
        console.error('Error blocking user:', error);
        alert('Failed to block user');
      }
    });
  }
  announcement = {
  subject: '',
  message: ''
};

sendAnnouncement() {
  if (!this.announcement.subject || !this.announcement.message) {
    alert('Please fill in both subject and message.');
    return;
  }
  this.userService.sendAnnouncement(this.announcement).subscribe({
    next: () => {
      alert('Announcement sent successfully!');
      this.announcement = { subject: '', message: '' };
    },
    error: (error) => {
      console.error('Error sending announcement:', error);
      alert('Failed to send announcement.');
    }
  });
}
  unblockUser(user: ExtendedUser) {
    this.userService.unblockUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        alert('User unblocked!');
      },
      error: (error) => {
        console.error('Error unblocking user:', error);
        alert('Failed to unblock user');
      }
    });
  }

  addAdmin() {
    if (!this.adminData.email || !this.adminData.password || !this.adminData.fullName || !this.adminData.phoneNumber || !this.adminData.address) {
      alert('Please fill all admin fields');
      return;
    }
    const adminPayload = {
      ...this.adminData,
      phoneNumber: '+1 234-567-8901' // dummy phone number for registration
    };
    this.userService.addAdmin(adminPayload).subscribe({
      next: () => {
        alert('Admin added successfully!');
        this.adminData = { email: '', password: '', fullName: '', phoneNumber: '', address: '' };
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error adding admin:', error);
        alert('Failed to add admin');
      }
    });
  }
}