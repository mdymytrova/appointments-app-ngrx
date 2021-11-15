import { Injectable } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore.service';
import { ManagementService } from '../../interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagementServicesFirestore extends FirestoreService<ManagementService> {
  protected path = 'services';
}
