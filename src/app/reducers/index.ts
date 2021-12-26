import { routerReducer } from '@ngrx/router-store';
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
  auth: fromAuth.AuthState,
  router: 'router'
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  router: routerReducer
};

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('State before: ', state);
    console.log('Action', action);
    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : [];
