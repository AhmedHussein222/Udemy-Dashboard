import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { from, Observable } from 'rxjs';
import { db } from '../firebase.config';
import { ICategory } from '../Models/icategory';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor() {}

  getAll(): Observable<any[]> {
    return from(
      (async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Categories'));
          return querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        } catch (error) {
          console.error('Error getting categories: ', error);
          throw error;
        }
      })()
    );
  }

  getById(id: string): Observable<any> {
    return from(
      (async () => {
        try {
          const docRef = doc(db, 'Categories', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id };
          } else {
            throw new Error('Category not found');
          }
        } catch (error) {
          console.error('Error getting category: ', error);
          throw error;
        }
      })()
    );
  }

  create(category: ICategory): Observable<any> {
    return from(
      (async () => {
        try {
          const id = nanoid();
          const docRef = doc(db, 'Categories', id);
          await setDoc(docRef, { ...category, category_id: id });
          return { ...category, category_id: id, id };
        } catch (error) {
          console.error('Error adding category: ', error);
          throw error;
        }
      })()
    );
  }

  // تحديث فئة موجودة
  update(id: string, category: Partial<ICategory>): Observable<any> {
    return from(
      (async () => {
        try {
          const docRef = doc(db, 'Categories', id);
          await updateDoc(docRef, category);
          return { ...category, id };
        } catch (error) {
          console.error('Error updating category: ', error);
          throw error;
        }
      })()
    );
  }

  // حذف فئة
  delete(id: string): Observable<void> {
    return from(
      (async () => {
        try {
          const docRef = doc(db, 'Categories', id);
          await deleteDoc(docRef);
        } catch (error) {
          console.error('Error deleting category: ', error);
          throw error;
        }
      })()
    );
  }
}
