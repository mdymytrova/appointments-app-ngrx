import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CallState, LoadingState } from '../../../store/reducers';
import { ManagementTask } from '../../interfaces/management-task.interface';
import { ManagementTasksActions } from '../action-types';

export const managementFeatureKey = 'management';

export interface ManagementState extends EntityState<ManagementTask>{
    callState: CallState
};

export const adapter = createEntityAdapter<ManagementTask>({
    sortComparer: (a, b) => a.order - b.order
});

const initialManagementState: ManagementState = adapter.getInitialState({
    callState: LoadingState.INIT
});

export const managementReducer = createReducer(
    initialManagementState,
    on(ManagementTasksActions.managementTasksLoad, (state, action) => {
        return {
            ...state,
            callState: LoadingState.LOADING
        }
    }),
    on(ManagementTasksActions.managementTasksLoadSuccess, (state, {tasks}) => {
        return adapter.setAll(tasks, {...state, callState: LoadingState.LOADED})
    }),
    on(ManagementTasksActions.managementTasksLoadFail, (state, action) => {
        return {
            ...state,
            callState: {errorMessage: action.errorMessage}
        }
    })
);

export const { selectAll } = adapter.getSelectors();