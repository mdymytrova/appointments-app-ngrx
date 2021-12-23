import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ManagementServicesApiService } from './management-services-api.service';

@Injectable({
  providedIn: 'root'
})

export class ServiceEditGuard implements CanActivate {
  
  constructor(
    public router: Router,
    private managementServicesApiService: ManagementServicesApiService
  ){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> {
      return this.managementServicesApiService.managementServices$.pipe(
        filter((data: any) => data.length),
        take(1),
        switchMap(() => of(true)),
        catchError(err => {
          return throwError(err);
        })
      )

  }

}