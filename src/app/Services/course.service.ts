import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { db } from '../firebase.config';
import { Icourse } from '../Models/icourse';
import { Iuser } from '../Models/iuser/iuser';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor() {}

  getAll(collectionName: string): Observable<Icourse[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          return querySnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                course_id: doc.id,
              } as Icourse)
          );
        } catch (error) {
          console.error('Error getting courses:', error);
          throw error;
        }
      })()
    );
  }

  getLatestCourses(collectionName: string): Observable<Icourse[]> {
    return from(
      (async () => {
        try {
          const q = query(
            collection(db, collectionName),
            orderBy('created_at', 'desc'),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                course_id: doc.id,
              } as Icourse)
          );
        } catch (error) {
          console.error('Error getting latest courses:', error);
          throw error;
        }
      })()
    );
  }

  getAllInstructors(collectionName: string): Observable<Iuser[]> {
    return from(
      (async () => {
        try {
          const q = query(
            collection(db, collectionName),
            where('role', '==', 'instructor')
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                user_id: doc.id,
              } as Iuser)
          );
        } catch (error) {
          console.error('Error getting instructors:', error);
          throw error;
        }
      })()
    );
  }
}
