import { Injectable } from '@angular/core';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { db } from '../firebase.config';
import { Ienrollment } from '../Models/iuser/ienrollment';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor() {}

  private convertToEnrollment(doc: any): Ienrollment {
    const data = doc.data();
    return {
      completed: data['completed'] || false,
      course_id: data['course_id'] || '',
      enrolledAt: data['enrolledAt']
        ? new Date(data['enrolledAt'].seconds * 1000)
        : new Date(),
      enrollmentId: doc.id,
      payment_status: data['payment_status'] || false,
      progress: data['progress'] || 0,
      user_id: data['user_id'] || '',
    };
  }

  getAll(collectionName: string): Observable<Ienrollment[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          return querySnapshot.docs.map((doc) => this.convertToEnrollment(doc));
        } catch (error) {
          console.error('Error getting enrollments:', error);
          throw error;
        }
      })()
    );
  }

  getLatestEnrollments(collectionName: string): Observable<Ienrollment[]> {
    return from(
      (async () => {
        try {
          const q = query(
            collection(db, collectionName),
            orderBy('enrolledAt', 'desc'),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map((doc) => this.convertToEnrollment(doc));
        } catch (error) {
          console.error('Error getting latest enrollments:', error);
          throw error;
        }
      })()
    );
  }
}
