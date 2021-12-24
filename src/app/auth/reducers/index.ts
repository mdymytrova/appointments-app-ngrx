import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { User } from '../auth.service';
import { AuthActions } from '../action-types';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: User | null
}

export const initialAuthState: AuthState = {
  user: null
};


export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return {
      user: action.user
    }
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      user: null
    }
  })
);
