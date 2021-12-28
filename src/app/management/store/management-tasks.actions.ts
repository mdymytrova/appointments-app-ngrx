import { createAction, props } from '@ngrx/store';
import { ManagementTask } from '../interfaces/management-task.interface';

export const managementTasksLoad = createAction(
    '[Management Tasks Resolver] Load management tasks'
);

export const managementTasksLoadSuccess = createAction(
    '[Management Tasks Load Effect] Load management tasks success',
    props<{tasks: ManagementTask[]}>()
)

export const managementTasksLoadFail = createAction(
    '[Management Tasks Load Effect] Load management tasks fail',
    props<{errorMessage: string}>()
)