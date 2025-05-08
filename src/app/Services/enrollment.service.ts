import { Injectable } from '@angular/core';
import { Ienrollment } from '../Models/iuser/ienrollment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private firestore : AngularFirestore ) { }
     getAll(collectionName: string): Observable<Ienrollment[]> {
       return this.firestore.collection<Ienrollment>(collectionName).valueChanges();
     }

     getLatestEnrollments(collectionName: string): Observable<Ienrollment[]> {
      return this.firestore.collection<Ienrollment>(
        collectionName,
        ref => ref.orderBy('enrolledAt', 'desc').limit(5)  
      )
      .valueChanges();
    }
    
}
