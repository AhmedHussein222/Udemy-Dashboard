import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser/iuser';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore : AngularFirestore ) { }
  getAll(collectionName: string): Observable<Iuser[]> {
    return this.firestore.collection<Iuser>(collectionName).valueChanges();
  }
  getOne(collectionName: string, id: string): Observable<Iuser> {
    return this.firestore.collection<Iuser>(collectionName).doc(id).valueChanges() as Observable<Iuser>;
  }
}
