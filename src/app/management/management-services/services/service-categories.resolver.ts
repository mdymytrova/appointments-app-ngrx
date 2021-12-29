import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { ServiceCategoryEntityService } from '../store/service-category-entity.service';

@Injectable()
export class ServiceCategoriesResolver implements Resolve<any> {
    constructor(private serviceCategoryEntityService: ServiceCategoryEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.serviceCategoryEntityService.loaded$.pipe(
            tap(loaded => {
                if(!loaded) {
                    this.serviceCategoryEntityService.getAll();
                }
            }),
            filter(loaded => loaded),
            first()
        )
    };
}