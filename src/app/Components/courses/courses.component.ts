import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnpublishedCoursesService } from '../../Services/unpublished-courses.service';
import { Icourse } from '../../Models/icourse';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: Icourse[] = [];
  selectedCourse: Icourse | null = null;
  showModal = false;
 

  constructor(
    private courseService: UnpublishedCoursesService,
  
  ){}

  ngOnInit(): void {
  
    this.loadCourses();
  }

 
  loadCourses(): void {
    this.courseService.getUnpublishedCourses().subscribe(course => {
      this.courses = course;
      console.log('Unpublished courses:', this.courses);
      
    });
    
  }

 
  accept(courseId: string) {
    this.courseService.acceptCourse(courseId).subscribe(() => {
      console.log(`Course ${courseId} is now published`);
      this.loadCourses();
      this.closePreview(); 
    }, (error) => {
      console.error('Error publishing course:', error);
    });
  }
  delete(courseId: string) {
  this.courseService.deleteCourse(courseId).subscribe(() => {
    console.log(`Course ${courseId} deleted successfully`);
    this.loadCourses();
    this.closePreview(); 
  }, error => {
    console.error('Error deleting course: ', error);
  });
}

preview(course: Icourse) {
    this.selectedCourse = course;
    this.showModal = true;
  }

  closePreview() {
    this.showModal = false;
    this.selectedCourse = null;
  }

 }
