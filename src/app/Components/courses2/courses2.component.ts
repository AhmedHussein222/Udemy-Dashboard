import { Component } from '@angular/core';

@Component({
  selector: 'app-courses2',
  templateUrl: './courses2.component.html',
  styleUrls: ['./courses2.component.css'],
})
export class Courses2Component {
  selectedAction: string | null = null;

  approveCourse(courseId: string): void {
    console.log(`Course ${courseId} approved.`);
    // Add logic to approve the course
  }

  rejectCourse(courseId: string): void {
    console.log(`Course ${courseId} rejected.`);
    // Add logic to reject the course
  }

  removeCourse(courseName: string): void {
    console.log(`Course ${courseName} removed.`);
    // Add logic to remove the course
  }
}
