import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { ManagementServiceEntityService } from '../store/management-service-entity.service';

@Injectable()
export class ManagementServicesResolver implements Resolve<any> {
    constructor(private managementServiceEntityService: ManagementServiceEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.managementServiceEntityService.loaded$.pipe(
            tap(loaded => {
                if(!loaded) {
                    this.managementServiceEntityService.getAll();
                }
            }),
            filter(loaded => loaded),
            first()
        )
    };
}