import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersComponent } from '../users/users.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import FormsModule
import { AdminComponent } from '../admin/admin.component';
import { Courses2Component } from '../courses2/courses2.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [
    CommonModule,
    ChartModule,
    UsersComponent,
    Courses2Component,
    DashboardComponent,
    PaymentComponent,
    AdminComponent,
    ReactiveFormsModule,
    FormsModule,
  ], // Add FormsModule here
})
export class AdminDashboardComponent implements OnInit {
  private firestore = inject(AngularFirestore);
  private fb = inject(FormBuilder);
  users$: Observable<any[]> = new Observable();
  courses$: Observable<any[]> = new Observable();
  revenue$: Observable<number> = new Observable();
  loading = true;
  users: any[] = [];
  courses: any[] = [];
  instructors: any[] = [];
  userRoleChart!: Chart;
  courseAnalyticsChart!: Chart;
  isSearchVisible: boolean = false;
  activeSection: string = 'dashboard';
  selectedAction: string | null = null;
  settingsTabs: string[] = [
    'General',
    'User Permissions',
    'Course Policies',
    'Security',
    'Customization',
  ];
  activeTab: number = 0;
  generalSettingsForm = this.fb.group({
    siteTitle: [''],
    logo: [null],
    language: [''],
    tos: [''],
  });
  roles: { name: string; permissions: { name: string; enabled: boolean }[] }[] =
    [
      {
        name: 'Admin',
        permissions: [
          { name: 'View Users', enabled: true },
          { name: 'Edit Users', enabled: false },
        ],
      },
      {
        name: 'Instructor',
        permissions: [
          { name: 'View Courses', enabled: true },
          { name: 'Edit Courses', enabled: true },
        ],
      },
    ];
  themes: string[] = ['Light', 'Dark', 'System Default'];
  languages: string[] = ['English', 'Spanish', 'French'];
  adminEmail: string = '';
  newAdminEmail: string = '';
  constructor(private router: Router) {
    this.fetchData();
    this.fetchInstructors();
    this.initializeCharts();
  }

  ngOnInit(): void {}

  private fetchData() {
    this.users$ = this.firestore.collection('users').valueChanges();
    this.courses$ = this.firestore.collection('courses').valueChanges();
    this.revenue$ = this.firestore
      .collection('payments')
      .valueChanges()
      .pipe(
        map((payments: any[]) =>
          payments.reduce((total, payment) => total + payment.amount, 0)
        )
      );
    setTimeout(() => (this.loading = false), 1000);
  }

  private fetchInstructors() {
    this.firestore
      .collection('Instructors', (ref) =>
        ref.orderBy('rating', 'desc').limit(5)
      )
      .valueChanges()
      .subscribe((data) => {
        this.instructors = data;
      });
  }

  private initializeCharts() {
    this.userRoleChart = new Chart({
      title: { text: 'Users by Role' },
      series: [
        {
          type: 'pie',
          data: [],
        },
      ],
    });

    this.courseAnalyticsChart = new Chart({
      title: { text: 'Course Analytics' },
      series: [
        {
          type: 'column',
          data: [],
        },
      ],
    });
  }

  private updateCourseAnalyticsChart() {
    const courseData = this.courses.map((course) => ({
      name: course.title,
      y: course.views || 0,
    }));

    this.courseAnalyticsChart.ref$.subscribe((chart) => {
      chart.series[0].setData(courseData);
    });
  }

  navigateToUserDetails(userId: string) {
    this.router.navigate(['/user-details', userId]);
  }
  trackByUserId(_: number, user: any): string {
    return user.id;
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }

  switchSection(section: string): void {
    this.activeSection = section;
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  removeCourse(courseName: string): void {
    if (confirm(`Are you sure you want to remove the course: ${courseName}?`)) {
      console.log(`Course "${courseName}" removed.`);
    }
  }

  approveCourse(courseId: string): void {
    console.log(`Course with ID "${courseId}" approved.`);
  }

  rejectCourse(courseId: string): void {
    console.log(`Course with ID "${courseId}" rejected.`);
  }

  saveGeneralSettings(): void {
    console.log('General settings saved:', this.generalSettingsForm.value);
  }

  togglePermission(roleName: string, permissionName: string): void {
    const role = this.roles.find((r) => r.name === roleName);
    if (role) {
      const permission = role.permissions.find(
        (p) => p.name === permissionName
      );
      if (permission) {
        permission.enabled = !permission.enabled;
      }
    }
  }

  grantAdminPermission(email: string): void {
    if (email) {
      console.log(`Admin permission granted to: ${email}`);
      // Add logic to grant admin permission
    } else {
      console.error('Email is required to grant admin permission.');
    }
  }

  addAdmin(email: string): void {
    if (email) {
      console.log(`Adding new admin with email: ${email}`);
      // Add logic to handle adding the admin (e.g., API call)
      this.newAdminEmail = ''; // Clear the input field after submission
    } else {
      console.error('Email is required to add a new admin.');
    }
  }
}
