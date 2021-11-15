import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
export interface Roles {
  user: boolean;
  admin?: {
    requested: boolean;
    verified: boolean;
  };
};

export interface User {
  uid: string;
  email: string;
  roles: Roles;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn$!: Observable<boolean>;
  public isLoggedOut$!: Observable<boolean>;
  public isAdmin$!: Observable<boolean | undefined>;
  public user$!: Observable<User | null | undefined>;

  constructor(private auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    this.user$ = this.auth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isAdmin$ = this.user$.pipe(map(user => user?.roles?.admin?.verified));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
  }

  public login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((authData: any) => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        return error?.message;
      });
  }

  public emailSignup(email: string, password: string, asAdmin: boolean = false) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((authData: any) => {
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${authData?.user?.uid}`);
        const userData: User = {
          uid: authData?.user?.uid,
          email: authData?.user?.email,
          roles: {
            user: true,
            admin: {
              requested: asAdmin,
              verified: false
            }
          }
        };
        return userRef.set(userData, { merge: true });
      })
      .catch(error => {
        return error?.message;
      })
  }

  public logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }

}
