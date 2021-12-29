import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { ProviderEntityService } from '../store/provider-entity.service';

@Injectable()
export class ProvidersResolver implements Resolve<any> {
    constructor(private providersEntityService: ProviderEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.providersEntityService.loaded$.pipe(
            tap(loaded => {
                if(!loaded) {
                    this.providersEntityService.getAll();
                }
            }),
            filter(loaded => loaded),
            first()
        )
    };
}