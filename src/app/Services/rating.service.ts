import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Icourse } from '../Models/icourse';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private firestore: AngularFirestore) {}

  getAllCourses(): Observable<Icourse[]> {
    return this.firestore.collection<Icourse>('Courses').valueChanges();
  }

  getAverageRating(): Observable<number> {
    return this.getAllCourses().pipe(
      map(courses => {
        let totalRatingSum = 0;
        let totalRatingCount = 0;
  
        courses.forEach(course => {
          const rating = course.rating;
          if (rating?.rating_count && rating?.rate) {
            totalRatingSum += rating.rate * rating.rating_count;
            totalRatingCount += rating.rating_count;
          }
        });
  
        return totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;
      })
    );
  }
  
  
}
