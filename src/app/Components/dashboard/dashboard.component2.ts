import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Icourse } from '../../Models/icourse';
import { Iuser } from '../../Models/iuser/iuser';
import { CourseService } from '../../Services/course.service';
import { EnrollmentService } from '../../Services/enrollment.service';
import { RatingService } from '../../Services/rating.service';
import { UsersService } from '../../Services/users.service';
import { PaymentService } from '../../Services/payment.service';
import { Subject, catchError, combineLatest, map, of, takeUntil } from 'rxjs';
import { IenrollmentWithNames } from '../../Models/ienrollmentnames';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Loading states
  isUsersLoading = true;
  isCoursesLoading = true;
  isRevenueLoading = true;
  isRatingLoading = true;

  // Error states
  usersError: string | null = null;
  coursesError: string | null = null;
  revenueError: string | null = null;
  ratingError: string | null = null;

  // Data properties
  usersLength = 0;
  coursesLength = 0;
  revenue = 0;
  enrollmentsWithNames: IenrollmentWithNames[] = [];
  courses: Icourse[] = [];
  averageRating = 0;
  instructorsLength = 0;
  studentsLength = 0;
  latestCoursesWithInstructors: {
    courseName: string;
    createdAt: Date;
    instructorName: string;
  }[] = [];

  // Chart properties
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  Linecharts: Highcharts.Options = {};

  // Additional loading states
  isEnrollmentsLoading = true;
  isLatestCoursesLoading = true;

  // Additional error states
  enrollmentsError: string | null = null;
  latestCoursesError: string | null = null;
  constructor(
    private usersService: UsersService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private paymentService: PaymentService,
    private ratingService: RatingService
  ) {}
  ngOnInit(): void {
    // Get Revenue from Payments
    this.paymentService
      .getAllOrders()
      .pipe(
        takeUntil(this.destroy$),
        map((orders) => {
          const completedPayments = orders.filter(
            (order) => (order.status || '').toLowerCase() === 'completed'
          );
          return completedPayments.reduce(
            (sum, order) => sum + (order.amount || 0),
            0
          );
        }),
        catchError((error) => {
          console.error('Error fetching revenue:', error);
          this.revenueError = 'Failed to load revenue data';
          return of(0);
        })
      )
      .subscribe({
        next: (total) => {
          this.revenue = total;
          this.isRevenueLoading = false;
          this.revenueError = null;
          console.log('Total revenue calculated:', total);
        },
      });

    // Get Average Rating
    this.ratingService
      .getAverageRating()
      .pipe(
        // takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error fetching average rating:', error);
          this.ratingError = 'Failed to load rating data';
          this.isRatingLoading = false;
          return of(0);
        })
      )
      .subscribe({
        next: (rating) => {
          this.averageRating = rating;
          this.isRatingLoading = false;
          this.ratingError = null;
        },
      });

    // Get users count and roles distribution
    this.usersService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: Iuser[]) => {
          this.usersLength = users.length;
          this.instructorsLength = users.filter(
            (user) => user.role === 'instructor'
          ).length;
          this.studentsLength = users.filter(
            (user) => user.role === 'student'
          ).length;
          this.isUsersLoading = false;
          this.usersError = null;

          // Update users pie chart
          const studentCount = users.filter((u) => u.role === 'student').length;
          const instructorCount = users.filter(
            (u) => u.role === 'instructor'
          ).length;
          const adminCount = users.filter((u) => u.role === 'admin').length;

          this.chartOptions = {
            chart: { type: 'pie' },
            title: { text: 'Users by Role' },
            series: [
              {
                name: 'Users',
                type: 'pie',
                data: [
                  { name: 'Students', y: studentCount, color: '#483D8B' },
                  { name: 'Instructors', y: instructorCount, color: '#7B68EE' },
                  { name: 'Admins', y: adminCount, color: '#6A5ACD' },
                ],
              },
            ],
          };
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.isUsersLoading = false;
          this.usersError = 'Failed to load users data';
        },
      });

    // Get courses count
    this.courseService
      .getAll('Courses')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (courses: Icourse[]) => {
          this.coursesLength = courses.length;
          this.isCoursesLoading = false;
          this.coursesError = null;
        },
        error: (err) => {
          console.error('Error fetching courses:', err);
          this.isCoursesLoading = false;
          this.coursesError = 'Failed to load courses data';
        },
      }); // Get average ratingwith loading and error states
    this.ratingService
      .getAverageRating()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avg: number) => {
          this.averageRating = avg;
          this.isRatingLoading = false;
          this.ratingError = null;
          console.log('Average rating fetched:', avg); // Debug log
        },
        error: (err) => {
          console.error('Error fetching average rating:', err);
          this.isRatingLoading = false;
          this.ratingError = 'Failed to load rating data';
        },
      });

    // Initialize enrollment line chart
this.enrollmentService
  .getAll('Enrollments')
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (enrollments) => {
      const monthlyCounts = new Array(12).fill(0);
      enrollments.forEach((enroll) => {
        enroll.courses.forEach((course) => {
          if (course.enrolled_at) {
            const date = course.enrolled_at;
            const month = date.getMonth();
            monthlyCounts[month]++;
          }
        });
      });

          this.Linecharts = {
            chart: { type: 'line' },
            title: { text: 'Enrollment Over Time' },
            xAxis: {
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
            },
            yAxis: {
              title: { text: 'Enrollments Count' },
            },
            series: [
              {
                name: 'Enrollments',
                type: 'line',
                data: monthlyCounts,
                color: '#7B68EE',
              },
            ],
          };
          this.isEnrollmentsLoading = false;
          this.enrollmentsError = null;
        },
        error: (err) => {
          console.error('Error fetching enrollments:', err);
          this.isEnrollmentsLoading = false;
          this.enrollmentsError = 'Failed to load enrollment data';
        },
      });


    // Get latest enrollments with names 
combineLatest([
  this.usersService.getAll(),
  this.courseService.getAll('Courses'),
  this.enrollmentService.getLatestEnrollments('Enrollments'),
])
  .pipe(
    takeUntil(this.destroy$),
    map(([users, courses, enrollments]) => {
      return enrollments.flatMap((enroll) => {
        return enroll.courses.map((course) => {
          const user = users.find((u) => u.user_id === enroll.user_id);
          const matchedCourse = courses.find((c) => c.course_id === course.id); 
          return {
            userName: user?.first_name || 'Unknown',
            courseName: matchedCourse?.description || 'Unknown Course',
            enrolledAt: course.enrolled_at || enroll.timestamp,
          };
        });
      });
    })
  )
  .subscribe({
    next: (result) => {
      this.enrollmentsWithNames = result;
      this.isEnrollmentsLoading = false;
      this.enrollmentsError = null;
    },
    error: (err) => {
      console.error('خطأ في جلب أحدث الاشتراكات:', err);
      this.isEnrollmentsLoading = false;
      this.enrollmentsError = 'فشل في تحميل بيانات الاشتراك';
    },
  });

    // Get latest courses 
    combineLatest([
      this.courseService.getLatestCourses('Courses'),
      this.courseService.getAllInstructors('Users'),
    ])
      .pipe(
        takeUntil(this.destroy$),
        map(([courses, instructors]) => {
          return courses.map((course) => ({
            courseName: course.description || '(No description)',
            createdAt: course.created_at || new Date(),
            instructorName:
              instructors.find((u) => u.user_id === course.instructor_id)
                ?.first_name || 'Unknown',
          }));
        })
      )
      .subscribe({
        next: (result) => {
          this.latestCoursesWithInstructors = result;
          this.isLatestCoursesLoading = false;
          this.latestCoursesError = null;
        },
        error: (err) => {
          console.error('Error fetching latest courses:', err);
          this.isLatestCoursesLoading = false;
          this.latestCoursesError = 'Failed to load course data';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
