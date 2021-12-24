import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { login, logout } from './auth.actions';
import * as fromAppState from '../reducers';
export interface User {
  uid: string;
  email: string;
  admin: {
    requested: boolean;
    verified?: boolean;
  };
}
@Injectable()
export class AuthService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private store: Store<fromAppState.AppState>
  ) {
    this.auth.authState.pipe(
      switchMap((firebaseUser: any) => {
        return firebaseUser ?
          this.firestore.doc<User>(`users/${firebaseUser.uid}`).valueChanges() :
          of(null);
      }),
      tap((user) => {
        if (user) {
          this.store.dispatch(login({ user }));
        }
      })
    ).subscribe();
  }

  public login(email: string, password: string, signUpParam: boolean | null) {
    if (typeof signUpParam == 'boolean') {
      this.emailSignup(email, password, signUpParam);
    } else {
      this.signIn(email, password);
    }
  }

  private signIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(() => this.router.navigate(['/']))
      .catch((error) => {
        this.errorSubject.next(error?.message);
      });
  }

  private emailSignup(email: string, password: string, asAdmin: boolean = false) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((authData: any) => {
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${authData?.user?.uid}`);
        const userData: User = {
          uid: authData?.user?.uid,
          email: authData?.user?.email,
          admin: {
            requested: asAdmin,
            verified: false
          }
        };
        return userRef.set(userData, { merge: true });
      })
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.errorSubject.next(error?.message);
      });
  }

  public logout() {
    this.auth.signOut();
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

}
