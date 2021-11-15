import { Injectable } from '@angular/core';
import { FirestoreService } from '../../core/services/firestore.service';
import { ManagementTask } from '../interfaces/management-task.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagementTasksFirestore extends FirestoreService<ManagementTask> {
  protected path = 'managementTaskList';
}
