import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { ManagementProvidersApiService } from './providers-api.service';

@Injectable({
  providedIn: 'root'
})

export class ProviderEditGuard implements CanActivate {
  
  constructor(
    public router: Router,
    private managementProvidersApiService: ManagementProvidersApiService
  ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> {
      return this.managementProvidersApiService.providers$.pipe(
        filter((data: any) => data.length),
        take(1),
        switchMap(() => of(true)),
        catchError(err => {
          return throwError(err);
        })
      )
  }

}