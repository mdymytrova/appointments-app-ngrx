import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromApp from '../reducers';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isAdmin } from './auth.selectors';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    private store: Store<fromApp.AppState>
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.store.pipe(select(isAdmin));
  }

}