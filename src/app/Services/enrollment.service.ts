import { Injectable } from '@angular/core';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
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
      user_id: data['user_id'] || '',
      timestamp: data['timestamp']
        ? new Date(data['timestamp'].seconds * 1000)
        : new Date(),
      courses:
        data['courses']?.map((course: any) => ({
          id: course['id'] || '',
          title: course['title'] || '',
          thumbnail: course['thumbnail'] || '',
          progress: course['progress'] || 0,
          completed_lessons: course['completed_lessons'] || [],
          enrolled_at: course['enrolled_at']
            ? new Date(course['enrolled_at'].seconds * 1000)
            : new Date(),
          last_accessed: course['last_accessed']
            ? new Date(course['last_accessed'].seconds * 1000)
            : new Date(),
        })) || [],
    };
  }

  getAll(collectionName: string): Observable<Ienrollment[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          return querySnapshot.docs.map((doc) => this.convertToEnrollment(doc));
        } catch (error) {
          console.error('Error fetching enrollments:', error);
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
            orderBy('timestamp', 'desc'),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map((doc) => this.convertToEnrollment(doc));
        } catch (error) {
          console.error('Error fetching latest enrollments:', error);
          throw error;
        }
      })()
    );
  }
}
