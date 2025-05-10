import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnpublishedCoursesService } from '../../Services/unpublished-courses.service';
import { Icourse } from '../../Models/icourse';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html',
})
export class CoursesComponent  {
  courses: Icourse[] = [];

  constructor(
    private courseService: UnpublishedCoursesService,
    private firestore: AngularFirestore
  )
   {
     this.loadCourses();
  }

  // ngOnInit(): void {
  //   // تحميل البيانات في ngOnInit بدلاً من constructor
  //   this.loadCourses();
  // }

  // تحميل الكورسات من الخدمة
  loadCourses(): void {
    this.courseService.getUnpublishedCourses().subscribe(course => {
      this.courses = course;
      console.log('Unpublished courses:', this.courses);
    });
  }

  // تحديث الكورس إلى is_published = true
  accept(courseId: string) {
    this.firestore
      .collection('Courses')
      .doc(courseId)
      .update({ is_published: true })
      .then(() => {
        console.log(`Course ${courseId} is now published`);
        this.refreshCourses();  // إعادة تحميل الكورسات
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  }

  // حذف الكورس من Firestore
  delete(courseId: string) {
    this.firestore
      .collection('Courses')
      .doc(courseId)
      .delete()
      .then(() => {
        console.log(`Course ${courseId} deleted successfully`);
        this.refreshCourses();  // إعادة تحميل الكورسات بعد الحذف
      })
      .catch((error) => {
        console.error('Error deleting course: ', error);
      });
  }

  // معاينة الكورس
  preview(course: Icourse) {
    console.log('Preview course:', course);
  }

  // إعادة تحميل الكورسات بعد التحديث أو الحذف
  private refreshCourses() {
    this.loadCourses();  // يعيد تحميل الكورسات من الخدمة
  }
}
