import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Icourse } from '../Models/icourse';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser/iuser';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private firestore : AngularFirestore ) { }
    getAll(collectionName: string): Observable<Icourse[]> {
      return this.firestore.collection<Icourse>(collectionName).valueChanges();
    }


    getLatestCourses(collectionName: string): Observable<Icourse[]> {
      return this.firestore.collection<Icourse>(
        collectionName,
        ref => ref.orderBy('created_at', 'desc').limit(5)
      ).valueChanges();
    }
    

    getAllInstructors(collectionName: string): Observable<Iuser[]> {
      return this.firestore.collection<Iuser>(
        collectionName,
        ref => ref.where('role', '==', 'instructor')  
      ).valueChanges();
    }
    
    
}
