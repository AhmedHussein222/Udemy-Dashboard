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

  getUserByEmail(email: string): Observable<Iuser | null> {
    return from(
      (async () => {
        try {
          const q = query(collection(db, 'Users'), where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            console.log('Firebase user data:', data); // Debug log
            return {
              id: doc.id,
              user_id: data['user_id'] || doc.id,
              first_name: data['first_name'] || '',
              last_name: data['last_name'] || '',
              email: data['email'] || email,
              password: data['Password'] || data['password'] || '', // Try both cases
              role: data['role'] || '',
              gender: data['gender'] || '',
              bio: data['bio'] || '',
              created_at: data['created_at'] || new Date(),
              profile_picture: data['profile_picture'] || '',
            } as Iuser;
          }
          return null;
        } catch (error) {
          console.error('Error getting user by email: ', error);
          throw error;
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
}
