import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore : AngularFirestore ) { }
  getAll(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).valueChanges();
  }
  getOne(collectionName: string, id: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(id).valueChanges();
  }

  // جلب بيانات مع استعلام
  query(collectionName: string, field: string, condition: any, value: any): Observable<any[]> {
    return this.firestore.collection(collectionName, 
      ref =>  ref.where(field, condition, value)
    ).valueChanges({ idField: 'id' });
  }

}
