import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as fromApp from '../../store/reducers';
import { first, tap } from 'rxjs/operators';
import { managementTasksLoad } from '../store/management-tasks.actions';
import { tasksLoaded } from '../store/management-tasks.selectors';

@Injectable()
export class ManagementTasksResolver implements Resolve<any> {
    constructor(private store: Store<fromApp.AppState>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store.pipe(
            first(),
            select(tasksLoaded),
            tap((dataLoaded) => {
                if (!dataLoaded) {
                    this.store.dispatch(managementTasksLoad());
                }
            })
        );
    }
}