import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ServiceCategoriesFirestore } from './service-categories.firestore';
import { ManagementServicesStore } from './management-services.store';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoriesApiService {
  constructor(
    private firestore: ServiceCategoriesFirestore,
    private store: ManagementServicesStore
  ) {
    this.firestore.collection$().pipe(
      map(categories => [{id: 'general', name: 'General'}, ...categories]),
      tap((categories) => {
        this.store.setState({
          serviceCategories: categories
        });
      })
    ).subscribe();
  }

  get serviceCategories$(): Observable<ServiceCategory[]> {
    return this.store.serviceCategories$;
  }

  get selectedCategory$(): Observable<ServiceCategory | null> {
    return this.store.selectedCategory$;
  }

  public setSelectedCategory(id: string | null) {
    this.store.setState({
      selectedCategoryId: id
    });
  }

  public createServiceCategory(service: ServiceCategory) {
    return this.firestore.create(service);
  }

  public getServiceCategory(id: string) {
    return this.firestore.doc$(id);
  }

  public updateServiceCategory(service: ServiceCategory, id: string) {
    return this.firestore.update(id, service);
  }

  public deleteServiceCategory(id: string) {
    return this.firestore.delete(id);
  }
}
