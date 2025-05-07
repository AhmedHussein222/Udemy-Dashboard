import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser/iuser';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore: AngularFirestore = inject(AngularFirestore);
  constructor() {}
  getAll(collectionName: string): Observable<Iuser[]> {
    return this.firestore.collection<Iuser>(collectionName).valueChanges();
  }
  getOne(collectionName: string, id: string): Observable<Iuser> {
    return this.firestore
      .collection<Iuser>(collectionName)
      .doc(id)
      .valueChanges() as Observable<Iuser>;
  }

  getByEmail(collectionName: string, email: string): Observable<Iuser[]> {
    return this.firestore
      .collection<Iuser>(collectionName, (ref) =>
        ref.where('email', '==', email)
      )
      .valueChanges();
  }

  // جلب بيانات مع استعلام
  // query(collectionName: string, field: string, condition: any, value: any): Observable<any[]> {
  //   return this.firestore.collection(collectionName, ref =>
  //     ref.where(field, condition, value)
  //   ).valueChanges({ idField: 'id' });
  // }
}
