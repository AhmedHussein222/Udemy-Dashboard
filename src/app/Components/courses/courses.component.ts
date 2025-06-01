import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Icourse } from '../../Models/icourse';
import { UnpublishedCoursesService } from '../../Services/unpublished-courses.service';

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

  constructor(private courseService: UnpublishedCoursesService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getUnpublishedCourses().subscribe((course) => {
      this.courses = course;
      console.log('Unpublished courses:', this.courses);
    });
  }

  accept(courseId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to accept this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.acceptCourse(courseId).subscribe(
          () => {
            Swal.fire(
              'Accepted!',
              'Course has been accepted successfully.',
              'success'
            );
            this.loadCourses();
            this.closePreview();
          },
          (error) => {
            Swal.fire(
              'Error!',
              'An error occurred while accepting the course.',
              'error'
            );
            console.error('Error publishing course:', error);
          }
        );
      }
    });
  }
  delete(courseId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(courseId).subscribe(
          () => {
            Swal.fire(
              'Deleted!',
              'Course has been deleted successfully.',
              'success'
            );
            this.loadCourses();
            this.closePreview();
          },
          (error) => {
            Swal.fire(
              'Error!',
              'An error occurred while deleting the course.',
              'error'
            );
            console.error('Error deleting course: ', error);
          }
        );
      }
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
