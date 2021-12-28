import { createReducer, on } from '@ngrx/store';
import { CallState, LoadingState } from '../../../store/reducers';
import { User } from '../../auth.service';
import { AuthActions } from '../action-types';

export const authFeatureKey = 'auth';
export interface AuthState {
  user: User | null;
  callState: CallState
}

export const initialAuthState: AuthState = {
  user: null,
  callState: LoadingState.INIT
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginStart, (state, action) => {
    return {
      ...state,
      callState: LoadingState.LOADING
    }
  }),
  on(AuthActions.loginSuccess, (state, {user}) => {
    return {
      ...state,
      callState: LoadingState.LOADED,
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
      callState: {errorMessage: action.message}
    }
  }),
  on(AuthActions.signupStart, (state, action) => {
    return {
      ...state,
      callState: LoadingState.INIT
    }
  }),
  on(AuthActions.signupFail, (state, action) => {
    return {
      ...state,
      callState: {errorMessage: action.message}
    }
  }),
  on(AuthActions.relogin, (state, action) => {
    return {
      ...state,
      callState: LoadingState.LOADED
    }
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      ...state,
      user: null,
      callState: LoadingState.INIT
    }
  }),
  on(AuthActions.getAuthDataStart, (state, action) => {
    return {
      ...state,
      callState: LoadingState.LOADING
    }
  }),
  on(AuthActions.getAuthDataFail, (state, action) => {
    return {
      ...state,
      error: action.message,
      callState: {errorMessage: action.message}
    }
  }),
  on(AuthActions.noAuthData, (state, action) => {
    return {
      ...state,
      user: null,
      callState: LoadingState.LOADED
    }
  }),
  on(AuthActions.getUserDataStart, (state, action) => {
    return {
      ...state,
      callState: LoadingState.LOADING
    }
  }),
  on(AuthActions.getUserDataFail, (state, action) => {
    return {
      ...state,
      callState: {errorMessage: action.message}
    }
  }),
  on(AuthActions.setUserDataStart, (state, action) => {
    return {
      ...state,
      callState: LoadingState.LOADING
    }
  }),
  on(AuthActions.setUserDataFail, (state, action) => {
    return {
      ...state,
      callState: {errorMessage: action.message}
    }
  }),
);
