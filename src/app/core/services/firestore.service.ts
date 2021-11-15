import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService<T> {
  protected abstract path: string;

  constructor(protected firestore: AngularFirestore) { }

  collection$(queryFn?: QueryFn): Observable<T[]> {
    return this.firestore.collection<T>(this.path, queryFn).valueChanges({ idField: 'id' });
  }

  doc$(id: string): Observable<T | undefined> {
    return this.firestore.doc<T>(`${this.path}/${id}`).valueChanges({ idField: 'id' });
  }

  create(value: Partial<T>) {
    const id = this.firestore.createId();
    return this.firestore.collection(`${this.path}`).doc(id).set(Object.assign({}, { id }, value));
  }

  update(id: string, value: T) {
    return this.firestore.collection(`${this.path}`).doc(id).update(value);
  }

  delete(id: string) {
    return this.firestore.collection(`${this.path}`).doc(id).delete();
  }

  batch() {
    return this.firestore.firestore.batch();
  }

  batchUpdate(value: any, queryFn?: QueryFn) {
    const collectionRef = this.firestore.collection(`${this.path}`, queryFn).get();
    const batch = this.firestore.firestore.batch();
    collectionRef.subscribe((data: any) => {
      data.forEach((element: any) => {
        batch.update(element.ref, value);
        batch.commit();
      })
    })
  }

}
