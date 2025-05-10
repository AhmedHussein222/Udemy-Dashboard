import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icourse } from '../Models/icourse';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { from } from 'rxjs';
import { db } from '../firebase.config';
import { Iuser } from '../Models/iuser/iuser';

@Injectable({
  providedIn: 'root'
})
export class UnpublishedCoursesService {
  constructor() {}

  getUnpublishedCourses(): Observable<Icourse[]> {
    const coursesRef = collection(db, 'Courses');
    const q = query(coursesRef, where('is_published', '==',false));
    const promise = getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        course_id: doc.id
      } as Icourse))
    );
    return from(promise);
  }
   acceptCourse(courseId: string): Observable<void> {
    const courseRef = doc(db, 'Courses', courseId);
    const updatePromise = updateDoc(courseRef, { is_published:true});
    return from(updatePromise);
  }

  deleteCourse(courseId: string): Observable<void> {
    const courseRef = doc(db, 'Courses', courseId);
    const promise = deleteDoc(courseRef);
    return from(promise);
  }
 
  
}
