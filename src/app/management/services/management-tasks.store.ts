import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreServiceNew } from '../../core/services/store-new.service';
import { StoreService } from '../../core/services/store.service';
import { ManagementTask } from '../interfaces/management-task.interface';

export interface IManagementTasksStore {
    taskList: ManagementTask[];
};

@Injectable({
    providedIn: 'root'
})
export class ManagementTasksStore extends StoreServiceNew<IManagementTasksStore> {
    taskList$: Observable<ManagementTask[]> = this.select(state => state.taskList);

    constructor() {
        super({
            taskList: []
        });
    }
}