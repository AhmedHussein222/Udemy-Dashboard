import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Icourse } from '../Models/icourse';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor() {}

  private getAllCourses(): Observable<Icourse[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Courses'));
          return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Ensure rating object has correct structure
            const rating = {
              rate:
                typeof data['rating']?.rate === 'number'
                  ? data['rating'].rate
                  : 0,
              rating_count:
                typeof data['rating']?.rating_count === 'number'
                  ? data['rating'].rating_count
                  : 0,
            };
            return {
              course_id: doc.id,
              title: data['title'] || '',
              description: data['description'] || '',
              rating: rating,
              price: data['price'] || 0,
              instructor_id: data['instructor_id'] || '',
              thumbnail: data['thumbnail'] || '',
              category_id: data['category_id'] || '',
              discount:
                typeof data['discount'] === 'number' ? data['discount'] : 0,
              duration:
                typeof data['duration'] === 'number' ? data['duration'] : 0,
              is_published: data['is_published'] === true,
              what_will_learn: Array.isArray(data['what_will_learn'])
                ? data['what_will_learn']
                : [],
              requirements: Array.isArray(data['requirements'])
                ? data['requirements']
                : [],
              language: data['language'] || 'English',
              level: data['level'] || 'Beginner',
              created_at: data['created_at']
                ? new Date(data['created_at'].seconds * 1000)
                : new Date(),
            } as Icourse;
          });
        } catch (error) {
          console.error('Error getting courses:', error);
          throw error;
        }
      })()
    );
  }
  getAverageRating(): Observable<number> {
    return this.getAllCourses().pipe(
      map((courses) => {
        // Filter out courses with valid ratings
        const coursesWithRatings = courses.filter(
          (course) =>
            typeof course.rating?.rate === 'number' &&
            typeof course.rating?.rating_count === 'number' &&
            course.rating.rating_count > 0
        );

        // If no courses have ratings, return 0
        if (coursesWithRatings.length === 0) {
          console.log('No courses found with valid ratings');
          return 0;
        }

        // Calculate weighted average rating
        const { totalSum, totalCount } = coursesWithRatings.reduce(
          (acc, course) => ({
            totalSum:
              acc.totalSum + course.rating.rate * course.rating.rating_count,
            totalCount: acc.totalCount + course.rating.rating_count,
          }),
          { totalSum: 0, totalCount: 0 }
        );

        const averageRating = totalCount > 0 ? totalSum / totalCount : 0;
        console.log(
          `Calculated average rating: ${averageRating.toFixed(1)} from ${
            coursesWithRatings.length
          } courses with ${totalCount} total ratings`
        );

        return parseFloat(averageRating.toFixed(1)); // Round to 1 decimal place
      })
    );
  }
}
