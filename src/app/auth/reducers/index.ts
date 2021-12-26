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
  user: User | null;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  error: null,
  loading: false
};


export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginStart, (state, action) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on(AuthActions.loginSuccess, (state, {user}) => {
    return {
      ...state,
      loading: false,
      error: null,
      user: {
        email: user.email,
        uid: user.uid,
        admin: user.admin
      }
    }
  }),
  on(AuthActions.loginFail, (state, action) => {
    return {
      ...state,
      error: action.message,
      loading: false
    }
  }),
  on(AuthActions.signupStart, (state, action) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on(AuthActions.signupFail, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.message
    }
  }),
  on(AuthActions.relogin, (state, action) => {
    return {
      ...state
    }
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      ...state,
      user: null
    }
  }),
  on(AuthActions.getAuthDataStart, (state, action) => {
    return {
      ...state,
      loading: true
    }
  }),
  on(AuthActions.getAuthDataFail, (state, action) => {
    return {
      ...state,
      error: action.message,
      loading: false
    }
  }),
  on(AuthActions.noAuthData, (state, action) => {
    return {
      ...state,
      user: null,
      loading: false
    }
  }),
  on(AuthActions.getUserDataStart, (state, action) => {
    return {
      ...state,
      loading: true
    }
  }),
  on(AuthActions.getUserDataFail, (state, action) => {
    return {
      ...state,
      error: action.message,
      loading: false
    }
  }),
  on(AuthActions.setUserDataStart, (state, action) => {
    return {
      ...state
    }
  }),
  on(AuthActions.setUserDataFail, (state, action) => {
    return {
      ...state,
      error: action.message,
      loading: false
    }
  }),
);
