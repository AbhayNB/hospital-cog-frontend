import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AdminAnalyticsService } from '../services/admin-analytics.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  users: ExtendedUser[] = [];
  searchTerm = '';
  filterRole = '';
  loading = false;
  editingUser: ExtendedUser | null = null;

  // Analytics and logs
  systemLogs: any[] = [];
  analytics: any = {};

  // Tabbed interface
  activeTab: string = 'dashboard';

  // New User
  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT',
  };

  // Doctors tab
  doctors: ExtendedUser[] = [];
  doctorLoading = false;

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
      next: (users: any[]) => {
        this.users = users.map(user => {
          const nameParts = user.fullName ? user.fullName.split(' ') : [''];
          return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            role: user.roles.includes('ROLE_ADMIN') ? 'ADMIN' :
                  user.roles.includes('ROLE_DOCTOR') ? 'DOCTOR' : 'PATIENT',
            enabled: user.enabled
          };
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
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

    this.userService.createUser(userData).subscribe({
      next: () => {
        alert('User created successfully!');
        this.loadUsers();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        alert('Failed to create user');
      }
    });
  }

  resetForm() {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'PATIENT',
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
}