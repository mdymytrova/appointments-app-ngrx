import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAuth from '../auth/reducers';

export interface AppState {
  auth: fromAuth.AuthState
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
