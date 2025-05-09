import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnpublishedCoursesService } from '../../Services/unpublished-courses.service';
import { Icourse } from '../../Models/icourse';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  courses$!: Observable<Icourse[]>;


  constructor(
    private courseService: UnpublishedCoursesService, 
    private firestore: AngularFirestore 
  ) {}

  // ngOnInit(): void {
  //   console.log('🚀 Getting unpublished courses from Firestore...');
    
  //   this.courseService.getUnpublishedCourses().subscribe({
  //     next: (courses) => {
  //       console.log("🔥 Fetched courses:", courses);
  //       this.courses$ = this.courseService.getUnpublishedCourses(); 
  //     },
  //     error: (err) => {
  //       console.error("❌ Error fetching courses:", err);
  //     }
  //   });
  // }
  ngOnInit(): void {
    console.log('🚀 Getting unpublished courses from Firestore...');
    
    this.courseService.getUnpublishedCourses().subscribe({
      next: (courses) => {
        console.log("🔥 Fetched courses:", courses);
        this.courses$ = this.courseService.getUnpublishedCourses(); 
      },
      error: (err) => {
        console.error("❌ Error fetching courses:", err);  
      },
      complete: () => {
        console.log("✅ Observable completed.");
      }
    });
  }
  

  

 
  accept(courseId: string) {
    this.firestore.collection('courses').doc(courseId).update({ is_published: true })
      .then(() => {
        console.log(`Course ${courseId} is now published`);
       
        this.courses$ = this.courseService.getUnpublishedCourses();
      })
      .catch((error) => {
        console.error('Error updating course: ', error);
      });
  }
  delete(courseId: string) {
    this.firestore.collection('courses').doc(courseId).delete()
      .then(() => {
        console.log(`Course ${courseId} deleted`);
        this.courses$ = this.courseService.getUnpublishedCourses();
      })
      .catch((error) => {
        console.error('Error deleting course: ', error);
      });
  }

  preview(course: any) {
    console.log('Preview course:', course);
  }
}
