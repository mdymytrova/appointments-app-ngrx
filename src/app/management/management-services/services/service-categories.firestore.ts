import { Injectable } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore.service';
import { ServiceCategory } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoriesFirestore extends FirestoreService<ServiceCategory> {
  protected path = 'service-categories';
}
