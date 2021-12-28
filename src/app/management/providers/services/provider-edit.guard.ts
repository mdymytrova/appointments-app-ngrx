import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, first, switchMap, take, tap } from 'rxjs/operators';
import { AppState } from '../../../store/reducers';
import { providersLoad } from '../store/providers.actions';
import { providersLoaded } from '../store/providers.selectors';

@Injectable({
  providedIn: 'root'
})

export class ProviderEditGuard implements CanActivate {
  
  constructor(
    public router: Router,
    private store: Store<AppState>
  ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> {
      return this.store.select(providersLoaded).pipe(
        tap((dataLoaded) => {
          if (!dataLoaded) {
            this.store.dispatch(providersLoad());
          }
        }),
        first(),
        switchMap(() => of(true)),
        catchError(() => of(false))
      )
  }

}