import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Icourse } from '../Models/icourse';
import { Observable, combineLatest, map } from 'rxjs';
import { Ienrollment } from '../Models/iuser/ienrollment';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(private firestore: AngularFirestore) {}

  getAllCourses(): Observable<Icourse[]> {
    return this.firestore.collection<Icourse>('Courses').valueChanges();
  }

  getEnrollments(): Observable<Ienrollment[]> {
    return this.firestore.collection<Ienrollment>('Enrollments').valueChanges();
  }

  getRevenue(): Observable<number> {
    return combineLatest([this.getAllCourses(), this.getEnrollments()]).pipe(
      map(([courses, enrollments]) => {
        return courses.reduce((total, course) => {
          const count = enrollments.filter(enr => enr.course_id === course.course_id).length;
          return total + (count * course.price);
        }, 0);
      })
    );
  }
}
