import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser/iuser';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore: AngularFirestore;

  constructor() {
    this.firestore = inject(AngularFirestore);
  }

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
    console.log(
      'Getting user by email:',
      email,
      'from collection:',
      collectionName
    );

    return this.firestore
      .collection<Iuser>(collectionName, (ref) =>
        ref.where('email', '==', email).limit(1)
      )
      .valueChanges();
  }
}
