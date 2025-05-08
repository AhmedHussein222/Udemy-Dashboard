import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { UsersService } from '../../Services/users.service';
import { Iuser } from '../../Models/iuser/iuser';
import { CourseService } from '../../Services/course.service';
import { Icourse } from '../../Models/icourse';
import { EnrollmentService } from '../../Services/enrollment.service';
import { Ienrollment } from '../../Models/iuser/ienrollment';
import { RevenueService } from '../../Services/revenue.service';
import { RatingService } from '../../Services/rating.service';
import { CommonModule } from '@angular/common';
// import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

import { catchError, combineLatest, forkJoin, map, of, switchMap } from 'rxjs';
import { IenrollmentWithNames } from '../../Models/ienrollmentnames';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  // imports: [CommonModule,HighchartsChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usersLength:number = 0;
  coursesLength:number = 0;
  revenue: number = 0;
  // latestEnrollments: Ienrollment[] = [];
  enrollmentsWithNames: IenrollmentWithNames[] = [];
  courses: Icourse[] = [];
  averageRating: number = 0
  instructorsLength: number = 0;
studentsLength: number = 0;
Highcharts: typeof Highcharts = Highcharts;
chartOptions: Highcharts.Options = {};
Linecharts: Highcharts.Options = {};
latestCoursesWithInstructors: {
  courseName: string;
  createdAt: Date;
  instructorName: string;
}[] = [];



  constructor(
   private usersService: UsersService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private revenueService: RevenueService,
    private ratingService: RatingService
  ) { 
    //Get all users number
    this.usersService.getAll('Users').subscribe((users: Iuser[]) => {
      this.usersLength = users.length;  });
      this.usersService.getAll('Users').subscribe((users: Iuser[]) => {
        this.instructorsLength = users.filter(user => user.role === 'instructor').length;
        this.studentsLength = users.filter(user => user.role === 'student').length;
      });

  //Get all courses number
      this.courseService.getAll('Courses').subscribe((courses: Icourse[]) => {
        this.coursesLength = courses.length;

      });

  //Get all revenue 
      this.revenueService.getRevenue().subscribe(total => {
        this.revenue = total;
      });

  //Get all average rating
      this.ratingService.getAverageRating().subscribe(avg => {
        this.averageRating = avg;
      });
  


   // Users Pie Chart
      this.usersService.getAll('Users').subscribe((users: Iuser[]) => {
        const studentCount = users.filter(u => u.role === 'student').length;
        const instructorCount = users.filter(u => u.role === 'instructor').length;
        const adminCount = users.filter(u => u.role === 'admin').length;
      
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
                { name: 'Admins', y: adminCount, color: '#6A5ACD' }
              ]
            }
          ]
        };
        console.log({ studentCount, instructorCount, adminCount });
  
      });
    

 // Enrollment Line Chart
 this.enrollmentService.getAll('Enrollments').subscribe(enrollments => {
  const monthlyCounts = new Array(12).fill(0);
  enrollments.forEach(enroll => {
    if (enroll.enrolledAt) {
      const date = (enroll.enrolledAt as any)?.toDate?.() || new Date(enroll.enrolledAt);
      const month = date.getMonth();
      monthlyCounts[month]++;
    }
  });

  this.Linecharts = {
    chart: { type: 'line' },
    title: { text: 'Enrollment Over Time' },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: { text: 'Enrollments Count' }
    },
    series: [{
      name: 'Enrollments',
      type: 'line',
      data: monthlyCounts,
      color: '#7B68EE'
    }]
  };
});
   
  //Get 5 latest enrollment
    combineLatest([
      this.usersService.getAll('Users'),
      this.courseService.getAll('Courses'),
      this.enrollmentService.getLatestEnrollments('Enrollments')
    ]).pipe(
      map(([users, courses, enrollments]) => {
        return enrollments.map(enroll => {
          const user = users.find(u => u.user_id === enroll.user_id);
          const course = courses.find(c => c.course_id === enroll.course_id);
  
          return {
            userName: user?.first_name || '',
            courseName: course?.description || '',
            enrolledAt: enroll.enrolledAt
          };
        });
      })
    ).subscribe(result => {
      this.enrollmentsWithNames = result;
    });
    // console.log(this.enrollmentsWithNames);


   //Get all 5 latest courses
  combineLatest([
    this.courseService.getLatestCourses('Courses'),
    this.courseService.getAllInstructors('Users')  
  ]).pipe(
    catchError(error => {
      console.error('Error loading courses or instructors:', error);
      return of([[], []]);
    }),
    map(([courses, instructors]) => {
      if (!courses.length) {
        console.warn('No courses found.');
      }
      if (!instructors.length) {
        console.warn('No instructors found.');
      }

      return courses.map(course => {
        const instructor = instructors.find(user => user.user_id === course.instructor_id);

        return {
          courseName: course.description || '(No description)',
          createdAt: course.created_at || new Date(), 
          instructorName: instructor ? instructor.first_name : 'Unknown'
        };
      });
    })
  ).subscribe(result => {
    console.log('Final Combined Result:', result);
    this.latestCoursesWithInstructors = result;
  });


  }  


ngOnInit(): void {


  // // Enrollment Line Chart
  // this.enrollmentService.getAll('Enrollments').subscribe(enrollments => {
  //   const monthlyCounts = new Array(12).fill(0);
  //   enrollments.forEach(enroll => {
  //     if (enroll.enrolledAt) {
  //       const date = (enroll.enrolledAt as any)?.toDate?.() || new Date(enroll.enrolledAt);
  //       const month = date.getMonth();
  //       monthlyCounts[month]++;
  //     }
  //   });

  //   this.Linecharts = {
  //     chart: { type: 'line' },
  //     title: { text: 'Enrollment Over Time' },
  //     xAxis: {
  //       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //     },
  //     yAxis: {
  //       title: { text: 'Enrollments Count' }
  //     },
  //     series: [{
  //       name: 'Enrollments',
  //       type: 'line',
  //       data: monthlyCounts,
  //       color: '#7B68EE'
  //     }]
  //   };
  // });

  // Users Pie Chart
  this.usersService.getAll('Users').subscribe((users: Iuser[]) => {
    const studentCount = users.filter(u => u.role === 'student').length;
    const instructorCount = users.filter(u => u.role === 'instructor').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

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
            { name: 'Admins', y: adminCount, color: '#6A5ACD' }
          ]
        }
      ]
    };
  });
}

    
  
  



  
}
