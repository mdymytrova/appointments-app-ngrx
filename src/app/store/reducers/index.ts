import { routerReducer } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AuthActions } from '../../auth/store/action-types';

export interface AppState {
  router: 'router'
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer
};

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('State before: ', state);
    console.log('Action', action);
    return reducer(state, action);
  }
}

export function clear(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === AuthActions.logout.type) {
      return reducer({...state, management: undefined}, action);
    } 
    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [clear] : [clear];

export enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED'
}

export interface ErrorState {
  errorMessage: string;
}

export type CallState = LoadingState | ErrorState;

export const getError = (callState: CallState) => {
  return (callState as ErrorState)?.errorMessage || null;
}
