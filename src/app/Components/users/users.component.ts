import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Chart, ChartModule } from 'angular-highcharts';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Ienrollment } from '../../Models/iuser/ienrollment';
import { Iuser } from '../../Models/iuser/iuser';
import { EnrollmentService } from '../../Services/enrollment.service';
import { UsersService } from '../../Services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ChartModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private userService = inject(UsersService);
  protected users: Iuser[] = [];
  protected enrollments: Ienrollment[] = [];
  protected editform!: FormGroup;
  protected roles = ['student', 'instructor', 'admin'];
  protected selectedRole = '';
  instructor_count!: number;
  admin_count!: number;
  student_count!: number;
  showEditModal = false;
  showDeleteModal = false;
  selectedUser!: Iuser;
  constructor(private enrollService: EnrollmentService) {
    this.userService.getAll().subscribe((data) => {
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

    this.enrollService.getAll('Enrollments').subscribe((data) => {
      this.enrollments = data;
    });

    this.editform = new FormGroup({
      user_id: new FormControl(''),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      bio: new FormControl(''),
      role: new FormControl('', [Validators.required]),
    });
  }
  editUser = () => {
    if (this.editform.invalid) {
      console.error('Form is invalid');
      return;
    }

    const userId = this.selectedUser.user_id;
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    const userData = {
      ...this.editform.value,
    };
    this.userService.updateUser(userId, userData).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.closeEditModal();
        this.refreshUsers();
        this.successModal('updated');
      },
      error: (error) => {
        console.error('Error updating user:', error);
      },
    });
  };

  // دالة مساعدة لتحديث قائمة المستخدمين
  refreshUsers() {
    this.userService.getAll().subscribe((users) => {
      this.users = users;
      // يمكنك إعادة حساب الإحصائيات هنا إذا لزم الأمر
    });
  }

  countEnrollmentsByUser(userId: string): number {
    return this.enrollments.filter(
      (enrollment) => enrollment.user_id === userId
    ).length;
  }

  openEditModal(user: Iuser) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
    this.editform.reset(); // إعادة تعيين النموذج أولاً
    this.editform.patchValue({
      ...user,
      // أي تحويلات إضافية للبيانات
    });
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  openDeleteModal(user: Iuser) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.confirmDelete(user);
        this.successModal('deleted');
        this.refreshUsers();
      }
    });
  }

  confirmDelete(user: Iuser) {
    if (!user.user_id) {
      this.errorModal('User ID is missing');

      return;
    }
    this.userService.deleteUser(user.user_id).subscribe({
      next: () => {
        return true;
      },
      error: (error) => {
        this.errorModal(error.message);
      },
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
    accessibility: {
      enabled: false,
    },
  });

  errorModal(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Something went wrong! , ${msg}`,
    });
  }
  successModal(action: string) {
    Swal.fire({
      title: `${action}`,
      text: `User has been ${action}.`,
      icon: 'success',
    });
  }
  trackByEmail(index: number, user: Iuser): string {
    return user.email;
  }
}
