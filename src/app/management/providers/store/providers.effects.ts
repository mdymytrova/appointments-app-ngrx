import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProvidersFirestore } from '../services/providers.firestore';
import { ProvidersActions } from './action-types';

@Injectable()
export class ProvidersEffects {
    constructor(
        private actions$: Actions,
        private firestore: ProvidersFirestore,
        private router: Router
    ) { }

    providersLoad$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ProvidersActions.providersLoad),
            switchMap(payload => {
                return this.firestore.collection().pipe(
                    map(providers => {
                        return ProvidersActions.providersLoadSuccess({providers});
                    }),
                    catchError(error => {
                        return of(ProvidersActions.providersLoadFail({errorMessage: 'Unable to load service providers.'}))
                    })
                )
            })
        )
    )

    providerUpdateStart$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ProvidersActions.providerUpdateStart),
            switchMap(payload => {
                return from(this.firestore.update(payload.update.id.toString(), payload.update.changes)).pipe(
                    map(() => {
                        this.router.navigate(['/manage', 'service-providers']);
                        return ProvidersActions.providerUpdateSuccess({update: payload.update});
                    }),
                    catchError(error => {
                        return of(ProvidersActions.providerUpdateFail({errorMessage: 'Unable to update provider.'}))
                    })
                )
            })
        )
    )
}