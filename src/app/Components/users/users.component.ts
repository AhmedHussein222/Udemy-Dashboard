import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartModule } from 'angular-highcharts';
import { Iuser } from '../../Models/iuser/iuser';
import { UsersService } from '../../Services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ChartModule, CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private firestore = inject(UsersService);

  users!: Iuser[];
  roles = ['student', 'instructor', 'admin'];
  selectedRole = '';
  instructor_count!: number;
  admin_count!: number;
  student_count!: number;

  showEditModal = false;
  showDeleteModal = false;
  selectedUser!: Iuser;

  constructor() {
    this.firestore.getAll().subscribe((data) => {
      this.users = data;
      data.forEach((user) => {
        if (user.role === 'student') {
          this.student_count = (this.student_count || 0) + 1;
        } else if (user.role === 'instructor') {
          this.instructor_count = (this.instructor_count || 0) + 1;
        } else if (user.role === 'admin') {
          this.admin_count = (this.admin_count || 0) + 1;
        }
      });

      this.testchart.ref$.subscribe((chart) => {
        chart.series[0].setData([
          { name: 'Student', y: this.student_count, color: '#483D8B' },
          { name: 'Instructors', y: this.instructor_count, color: '#7B68EE' },
          { name: 'Admin', y: this.admin_count, color: '#7B68EE' },
        ]);
      });
    });
  }

  openEditModal(user: Iuser) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = {} as Iuser;
  }

  openDeleteModal(user: Iuser) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUser = {} as Iuser;
  }

  saveUser() {
    if (!this.selectedUser.user_id) {
      console.error('No user ID found');
      return;
    }

    this.firestore
      .updateUser(this.selectedUser.user_id, {
        first_name: this.selectedUser.first_name,
        last_name: this.selectedUser.last_name,
        email: this.selectedUser.email,
        bio: this.selectedUser.bio,
        role: this.selectedUser.role,
      })
      .then(() => {
        console.log('User updated successfully');
        this.closeEditModal();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  }

  confirmDelete() {
    if (!this.selectedUser.user_id) {
      console.error('No user ID found');
      return;
    }

    this.firestore
      .deleteUser(this.selectedUser.user_id)
      .then(() => {
        console.log('User deleted successfully');
        this.closeDeleteModal();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }

  filteredUsers() {
    if (this.selectedRole) {
      return this.users.filter((user) => user.role === this.selectedRole);
    } else {
      return this.users;
    }
  }

  testchart = new Chart({
    title: { text: 'Users by Role' },
    series: [
      {
        type: 'pie',
        data: [],
      },
    ],
  });

  trackByEmail(index: number, user: Iuser): string {
    return user.email;
  }
}
