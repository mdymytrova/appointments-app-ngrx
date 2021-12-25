import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  authState$!: Observable<any>;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private store: Store<fromAppState.AppState>
  ) {
    this.authState$ = this.auth.authState;
  }

  public signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public logout() {
    return this.auth.signOut();
  }

  public signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  public currentUser() {
    return this.auth.currentUser;
  }

}
