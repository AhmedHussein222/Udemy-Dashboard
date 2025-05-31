import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { from, Observable } from 'rxjs';
import { ISubCategory } from '../Models/isubcategory';
import { db } from '../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  constructor() {}

  create(
    subcategory: Omit<ISubCategory, 'subcategory_id'>
  ): Observable<ISubCategory> {
    return from(
      (async () => {
        const id = nanoid();
        const docRef = doc(db, 'SubCategories', id);
        await setDoc(docRef, { ...subcategory, subcategory_id: id });
        return { ...subcategory, subcategory_id: id };
      })()
    );
  }

  getAll(): Observable<ISubCategory[]> {
    return from(
      (async () => {
        const querySnapshot = await getDocs(collection(db, 'Subcategories'));
        return querySnapshot.docs.map((doc) => doc.data() as ISubCategory);
      })()
    );
  }

  getByCategory(category_id: string): Observable<ISubCategory[]> {
    return from(
      (async () => {
        const q = query(
          collection(db, 'SubCategories'),
          where('category_id', '==', category_id)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => doc.data() as ISubCategory);
      })()
    );
  }

  update(
    subcategory_id: string,
    subcategory: Partial<ISubCategory>
  ): Observable<any> {
    return from(
      (async () => {
        const docRef = doc(db, 'SubCategories', subcategory_id);
        await updateDoc(docRef, subcategory);
        return { ...subcategory, subcategory_id };
      })()
    );
  }

  delete(subcategory_id: string): Observable<void> {
    return from(
      (async () => {
        const docRef = doc(db, 'SubCategories', subcategory_id);
        await deleteDoc(docRef);
      })()
    );
  }
}
