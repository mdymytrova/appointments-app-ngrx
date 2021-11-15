import { Injectable } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore.service';
import { ServiceProvider } from '../../interfaces/provider.interface';

@Injectable({
  providedIn: 'root'
})
export class ProvidersFirestore extends FirestoreService<ServiceProvider> {
  protected path = 'providers';
}
