import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { db } from '../firebase.config';

import { Iuser } from '../Models/iuser/iuser';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor() {}

  getAll(): Observable<any[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Users'));
          return querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        } catch (error) {
          console.error('Error getting users: ', error);
          throw error;
        }
      })()
    );
  }

  getUserById(userId: string): Observable<any> {
    return from(
      (async () => {
        const userRef = doc(db, 'Users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          return null;
        }
      })()
    );

  }

  updateUser(user_id: string, data: Partial<Iuser>): Observable<boolean> {
    return from(
      (async () => {
        const userRef = doc(db, 'Users', user_id);
        try {
          await updateDoc(userRef, data);
          console.log('Document updated successfully');
          return true;
        } catch (error) {
          console.error('Error updating document: ', error);
          throw error;
        }
      })()
    );
  }

  deleteUser(userId: string): Observable<void> {
    return from(
      (async () => {
        const userRef = doc(db, 'Users', userId);
        await deleteDoc(userRef);
        console.log('Document deleted');
      })()
    );
  }

  getAdmins(): Observable<Iuser[]> {
    return from(
      (async () => {
        const q = query(collection(db, 'Users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            } as Iuser)
        );
      })()
    );
  }

  // جلب بيانات مع استعلام
}
