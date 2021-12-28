import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getError, LoadingState } from '../../store/reducers';
import * as fromManagement from './reducers';

export const selectManagementState = createFeatureSelector<fromManagement.ManagementState>(fromManagement.managementFeatureKey);

export const managementTasks = createSelector(
    selectManagementState,
    fromManagement.selectAll
);

export const loading = createSelector(
    selectManagementState,
    state => state.callState === LoadingState.LOADING
);

export const tasksLoaded = createSelector(
    selectManagementState,
    state => state.callState === LoadingState.LOADED
);

export const errorMessage = createSelector(
    selectManagementState,
    state => getError(state.callState)
);
