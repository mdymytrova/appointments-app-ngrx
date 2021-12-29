import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { ProvidersFirestore } from '../services/providers.firestore';

@Injectable()
export class ProvidersDataService extends DefaultDataService<ServiceProvider> {
    constructor(private firestore: ProvidersFirestore, http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('Provider', http, httpUrlGenerator);
    }

    getAll(): Observable<ServiceProvider[]> {
        return this.firestore.collection().pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }

    getById(key: string): Observable<ServiceProvider> {
        return (this.firestore.doc$(key) as Observable<ServiceProvider>).pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }

    update(update: Update<ServiceProvider>): Observable<ServiceProvider> {
        return from(this.firestore.update(update.id as string, update.changes))
            .pipe(
                switchMap(() => this.getById(update.id as string)),
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    add(entity: ServiceProvider): Observable<ServiceProvider> {
        const id = this.firestore.createId();
        return from(this.firestore.create(entity, id)).pipe(
            switchMap(() => this.getById(id as string)),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    delete(key: string | number): Observable<string | number> {
        return from(this.firestore.delete(key as string)).pipe(
            switchMap((data) => of(key)),
            catchError(error => {
                return throwError(error);
            })
        );
    }
    
}
