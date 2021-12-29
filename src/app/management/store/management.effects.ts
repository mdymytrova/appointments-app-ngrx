import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ManagementTasksFirestore } from '../services/management-tasks.firestore';
import { ManagementTasksActions } from './action-types';

@Injectable()
export class ManagementEffects {
    constructor(
        private actions$: Actions,
        private firestore: ManagementTasksFirestore
        ) { }

    managementTasksLoad$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ManagementTasksActions.managementTasksLoad),
            switchMap(payload => {
                return this.firestore.collection().pipe(
                    map(tasks => {
                        return ManagementTasksActions.managementTasksLoadSuccess({tasks});
                    }),
                    catchError(error => {
                        return of(ManagementTasksActions.managementTasksLoadFail({errorMessage: 'Unable to load management tasks.'}))
                    })
                )
            })
        )
    )
}