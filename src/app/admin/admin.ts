import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../types/auth.types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  filterRole = '';

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'PATIENT',
  };

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
  }

  loadUsers() {
    // TODO: Implement user loading from backend
  }

  createUser() {
    // TODO: Implement user creation
  }

  editUser(user: User) {
    // TODO: Implement user editing
  }

  deleteUser(user: User) {
    // TODO: Implement user deletion
  }
}
