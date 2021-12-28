import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
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

  constructor(private auth: AngularFireAuth) {
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
