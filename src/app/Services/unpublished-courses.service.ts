import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icourse } from '../Models/icourse';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UnpublishedCoursesService {
  constructor(private firestore: AngularFirestore) {
    console.log("AngularFirestore injected:", firestore);
  }

  getUnpublishedCourses(): Observable<Icourse[]> {
    console.log('Getting unpublished courses from Firestore...');
    return this.firestore.collection<Icourse>('Courses', ref =>
      ref.where('is_published', '==', true)
    ).valueChanges({ idField: 'course_id' });
  }
}
