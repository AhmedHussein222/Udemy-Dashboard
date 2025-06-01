import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor() {}

  private getAllReviews(): Observable<any[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Reviews'));
          return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              reviewId: doc.id,
              course_id: data['course_id'] || '',
              rating: typeof data['rating'] === 'number' ? data['rating'] : 0,
              comment: data['comment'] || '',
              user_id: data['user_id'] || '',
              timestamp: data['timestamp']
                ? new Date(data['timestamp'].seconds * 1000)
                : new Date(),
            };
          });
        } catch (error) {
          console.error('Error getting reviews:', error);
          throw error;
        }
      })()
    );
  }

  getAverageRating(): Observable<number> {
    return this.getAllReviews().pipe(
      map((reviews) => {
  
        const validReviews = reviews.filter(
          (review) => typeof review.rating === 'number' && review.rating > 0
        );

     
        if (validReviews.length === 0) {
          console.log('No reviews found with valid ratings');
          return 0;
        }

       
        const totalSum = validReviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const averageRating = totalSum / validReviews.length;

        console.log(
          `Calculated average rating: ${averageRating.toFixed(1)} from ${
            validReviews.length
          } reviews`
        );

        return parseFloat(averageRating.toFixed(1)); 
      })
    );
  }
}