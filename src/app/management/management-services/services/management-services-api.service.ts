import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServicesFirestore } from './management-services.firestore';
import { ManagementServicesStore } from './management-services.store';

@Injectable({
  providedIn: 'root'
})
export class ManagementServicesApiService {
  constructor(
    private firestore: ManagementServicesFirestore,
    private store: ManagementServicesStore
  ) {
    this.firestore.collection$().pipe(
      tap(services => {
        this.store.setState({
          services
        })
      })
    ).subscribe();
  }

  get managementServices$() {
    return this.store.services$;
  }

  get managementServicesByCategory$() {
    return this.store.selectedServicesByCategory$;
  }

  get selectedService$() {
    return this.store.selectedService$;
  }

  public setSelectedService(id: string) {
    this.store.setState({
      selectedServiceId: id
    });
  }

  public getServicesByCategory(categoryId: string) {
    const query: [string, any, string] = categoryId === 'general' ? ['category', '==', ''] : ['category.id', '==', categoryId];
    return this.firestore.collection$(ref => ref.where(...query));
  }

  public getService(id: string) {
    return this.firestore.doc$(id);
  }

  public createService(service: Partial<ManagementService>) {
    return this.firestore.create(service);
  }

  public updateService(service: ManagementService, id: string) {
    return this.firestore.update(id, service);
  }

  public deleteService(id: string) {
    return this.firestore.delete(id);
  }

  public deleteServiceCategory(id: string) {
    this.firestore.batchUpdate({category: ''}, ref => ref.where('category.id', '==', id));
  }
}
