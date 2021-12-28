import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import * as fromApp from '../../../store/reducers';
import { providersLoad } from '../store/providers.actions';
import { providersLoaded } from '../store/providers.selectors';

@Injectable()
export class ProvidersResolver implements Resolve<any> {
    constructor(private store: Store<fromApp.AppState>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store.pipe(
            first(),
            select(providersLoaded),
            tap((dataLoaded) => {
                if (!dataLoaded) {
                    this.store.dispatch(providersLoad());
                }
            })
        );
    }
}