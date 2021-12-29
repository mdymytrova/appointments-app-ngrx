import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ServiceCategoriesFirestore } from '../services/service-categories.firestore';

@Injectable()
export class ServiceCategoryDataService extends DefaultDataService<ServiceCategory> {
    constructor(private firestore: ServiceCategoriesFirestore, http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('ServiceCategory', http, httpUrlGenerator);
    }

    getAll(): Observable<ServiceCategory[]> {
        return this.firestore.collection().pipe(
            map(categories => {
                return [{id: 'general', name: 'General'}, ...categories];
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    getById(key: string): Observable<ServiceCategory> {
        return (this.firestore.doc$(key) as Observable<ServiceCategory>).pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }

    update(update: Update<ServiceCategory>): Observable<ServiceCategory> {
        return from(this.firestore.update(update.id as string, update.changes))
            .pipe(
                switchMap(() => this.getById(update.id as string)),
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    add(entity: ServiceCategory): Observable<ServiceCategory> {
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
