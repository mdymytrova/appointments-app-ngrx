import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './reducers';

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>(fromAuth.authFeatureKey);

export const user = createSelector(
    selectAuthState,
    auth => auth.user
);

export const isAdmin = createSelector(
    user,
    user => !!user?.admin?.verified
);
