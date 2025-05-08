import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser/iuser';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly collectionName = 'Users';
  constructor(private firestore: AngularFirestore) {}
  getAll(): Observable<Iuser[]> {
    return this.firestore
      .collection<Iuser>(this.collectionName)
      .valueChanges({ idField: 'user_id' }); // Add idField to include document ID
  }

  getOne(id: string): Observable<Iuser> {
    return this.firestore
      .collection<Iuser>(this.collectionName)
      .doc(id)
      .valueChanges() as Observable<Iuser>;
  }
  updateUser(id: string, data: Partial<Iuser>): Promise<void> {
    return this.firestore
      .collection<Iuser>(this.collectionName)
      .doc(id)
      .update({ ...data });
  }
  deleteUser(id: string): Promise<void> {
    return this.firestore
      .collection<Iuser>(this.collectionName)
      .doc(id)
      .delete();
  }

  // جلب بيانات مع استعلام
  query(
    collectionName: string,
    field: string,
    condition: any,
    value: any
  ): Observable<any[]> {
    return this.firestore
      .collection(collectionName, (ref) => ref.where(field, condition, value))
      .valueChanges({ idField: 'id' });
  }
}
