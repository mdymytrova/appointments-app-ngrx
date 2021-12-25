import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessagesService } from '../../messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService<T> {
  protected abstract path: string;

  constructor(protected firestore: AngularFirestore, private messageService: MessagesService) { }

  collection$(queryFn?: QueryFn): Observable<T[]> {
    return this.firestore.collection<T>(this.path, queryFn).valueChanges({ idField: 'id' }).pipe(
      catchError((error) => {
        this.messageService.showMessage('Unable to load data.');
        return throwError(error);
      }),
    );
  }

  doc$(id: string): Observable<T | undefined> {
    return this.firestore.doc<T>(`${this.path}/${id}`).valueChanges({ idField: 'id' });
  }

  doc(id: string): AngularFirestoreDocument<T> {
    return this.firestore.doc<T>(`${this.path}/${id}`);
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
