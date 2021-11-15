import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ManagementTask } from '../interfaces/management-task.interface';
import { ManagementTasksFirestore } from './management-tasks.firestore';
import { ManagementTasksStore } from './management-tasks.store';

@Injectable({
  providedIn: 'root'
})
export class ManagementTasksApiService {

  constructor(
    private firestore: ManagementTasksFirestore,
    private store: ManagementTasksStore
  ) {
    this.firestore.collection$().pipe(
      tap(tasks => {
        this.store.setState({
          taskList: tasks.sort((taskA, taskB) => taskA.order - taskB.order)
        })
      })
    ).subscribe();
  }

  get managementTasks$(): Observable<ManagementTask[]> {
    return this.store.taskList$;
  }
}
