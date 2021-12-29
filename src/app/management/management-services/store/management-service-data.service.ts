import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServicesFirestore } from '../services/management-services.firestore';

@Injectable()
export class ManagementServiceDataService extends DefaultDataService<ManagementService> {
    constructor(private firestore: ManagementServicesFirestore, http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('ManagementService', http, httpUrlGenerator);
    }

    getAll(): Observable<ManagementService[]> {
        return this.firestore.collection().pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }

    getById(key: string): Observable<ManagementService> {
        return (this.firestore.doc$(key) as Observable<ManagementService>).pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }

    update(update: Update<ManagementService>): Observable<ManagementService> {
        return from(this.firestore.update(update.id as string, update.changes))
            .pipe(
                switchMap(() => this.getById(update.id as string)),
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    add(entity: ManagementService): Observable<ManagementService> {
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

    deleteCategory(id: string) {
        return this.firestore.batchUpdate({category: ''}, ref => ref.where('category.id', '==', id));
    }
    
}
