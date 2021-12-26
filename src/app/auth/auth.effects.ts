import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthFirestore } from './auth.firestore';
import { AuthService, User } from './auth.service';
import { AuthActions } from './action-types';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private firestore: AuthFirestore,
        private router: Router,
        private authService: AuthService
    ) { }

    loginStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginStart),
            switchMap(payload => {
                return from(this.authService.signIn(payload.email, payload.password)).pipe(
                    map(authData => {
                        return AuthActions.getAuthDataStart();
                    }),
                    catchError((errorResponse) => {
                        return of(AuthActions.loginFail({message: errorResponse?.message || 'Unable to log in.'}));
                    })
                );
            })
        )
    ); 

    loginSuccess$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap((data) => {
                if (data.redirect) {
                    return this.router.navigate(['']);
                } else {
                    return EMPTY;
                }
            })
        ), { dispatch: false }
    );

    relogin$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.relogin),
            map(() => {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    return AuthActions.loginSuccess({user: JSON.parse(userData), redirect: false});
                } else {
                    return AuthActions.logout();
                }
            })
        )
    );

    logout$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                this.authService.logout().then(() => {
                    localStorage.removeItem('userData');
                    this.router.navigate(['/']);
                });
            })
        ), { dispatch: false }
    );

    signupStart$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.signupStart),
            switchMap(payload => {
                return from(this.authService.signUp(payload.email, payload.password)).pipe(
                    map(authData => {
                        const user: User = {
                            uid: (<string>authData.user?.uid),
                            email: payload.email,
                            admin: {
                                requested: payload.asAdmin,
                                verified: false
                            }
                        };
                        return AuthActions.setUserDataStart({user});
                    }),
                    catchError((errorResponse) => {
                        return of(AuthActions.signupFail({message: errorResponse?.message || 'Unable to sign up.'}));
                    })
                );
            })
        )
    );

    getAuthDataStart$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.getAuthDataStart),
            switchMap(() => {
                return from(this.authService.currentUser()).pipe(
                    map(authData => {
                        if (authData && authData.uid) {
                            return AuthActions.getUserDataStart({uid: authData.uid});
                        } else {
                            return AuthActions.noAuthData();
                        }
                    }),
                    catchError((errorResponse) => {
                        return of(AuthActions.getAuthDataFail({message: errorResponse?.message || 'Unable to get authentication state.'}));
                    })
                );
            })
        )
    );

    getUserDataStart$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.getUserDataStart),
            switchMap(payload => {
                return from(this.firestore.doc(payload.uid as string).get()).pipe(
                    map(authData => {
                        const userData = authData.data();
                        localStorage.setItem('userData', JSON.stringify(userData));
                        return AuthActions.loginSuccess({user: userData as User, redirect: true});
                    }),
                    catchError((errorResponse) => {
                        return of(AuthActions.getUserDataFail({message: errorResponse?.message || 'Unable to find user data.'}));
                    })
                );
            })
        )
    );

    setUserDataStart$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.setUserDataStart),
            switchMap(({user}) => {
                const userRef: AngularFirestoreDocument<any> = this.firestore.doc(user.uid);
                return from(userRef.set(user, { merge: true })).pipe(
                    map(() => {
                        localStorage.setItem('userData', JSON.stringify(user));
                        return AuthActions.loginSuccess({user, redirect: true});
                    }),
                    catchError((errorResponse) => {
                        return of(AuthActions.setUserDataFail({message: errorResponse?.message || 'Unable to save user data.'}));
                    })
                );
            }),
        )
    );

}