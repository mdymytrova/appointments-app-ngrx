import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { ProvidersFirestore } from './providers.firestore';
import { ProvidersStore } from './providers.store';

@Injectable({
  providedIn: 'root'
})
export class ManagementProvidersApiService {

  constructor(
    private firestore: ProvidersFirestore,
    private store: ProvidersStore
  ) {
    this.firestore.collection$().pipe(
      tap(providers => {
        this.store.setState({
          providers
        });
      })
    ).subscribe()
  }

  get providers$() {
    return this.store.providers$;
  }

  get selectedProvider$() {
    return this.store.selectedProvider$;
  }

  public createProvider(service: Partial<ServiceProvider>) {
    return this.firestore.create(service);
  }

  public getProvider(id: string) {
    return this.firestore.doc$(id);
  }

  public setSelectedProvider(id: string) {
    return this.store.setState({
      selectedProviderId: id
    });
  }

  public updateProvider(service: ServiceProvider, id: string) {
    return this.firestore.update(id, service);
  }

  public deleteProvider(id: string) {
    return this.firestore.delete(id);
  }

}
