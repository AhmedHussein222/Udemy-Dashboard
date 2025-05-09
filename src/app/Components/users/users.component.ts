import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Chart, ChartModule } from 'angular-highcharts';
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
  // private userService = inject(UsersService);
  // private enrollService = inject(EnrollmentService);

  users!: Iuser[];
  enrollments!: Ienrollment[];
  editform: FormGroup;
  roles = ['student', 'instructor', 'admin'];
  selectedRole = '';
  instructor_count!: number;
  admin_count!: number;
  student_count!: number;
  showEditModal = false;
  showDeleteModal = false;
  selectedUser!: Iuser;
  constructor(
    private userService: UsersService,
    private enrollService: EnrollmentService
  ) {
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
    // this.userService
    //   .updateUser('1', { email: '123' })
    //   .then(() => {
    //     alert('User updated successfully');
    //   })
    //   .catch((error) => {
    //     alert('Error updating user:');
    //   });
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

    const userData = {
      ...this.editform.value,
      // إزالة user_id إذا كنت لا تريد تحديثه
      user_id: undefined,
    };

    this.userService
      .updateUser(this.editform.value.user_id, userData)
      .then(() => {
        console.log('User updated successfully');
        this.closeEditModal();
        // يمكنك إضافة تحديث للقائمة إذا لزم الأمر
        this.refreshUsers();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        // يمكنك إضافة رسالة خطأ للمستخدم
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

  // editUser() {
  //   console.log('Editing user:', this.editform.value);

  //   this.userService
  //     .updateUser(this.editform.value.user_id, {
  //       ...this.editform.value,
  //     })
  //     .subscribe({
  //       next: (response) => {
  //         console.log('User updated successfully');
  //         console.log('Response:', response);

  //         this.closeEditModal();
  //       },
  //       error: (error) => {
  //         console.error('Error updating user:', error);
  //       },
  //     });
  // }

  confirmDelete() {
    if (!this.selectedUser.user_id) {
      console.error('No user ID found');
      return;
    }

    this.userService
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
    accessibility: {
      enabled: false, 
    },
  });

  trackByEmail(index: number, user: Iuser): string {
    return user.email;
  }
}
