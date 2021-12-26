import { createAction, props } from '@ngrx/store';
import { User } from './auth.service';

export const loginStart = createAction('[Auth Login Page] Login start', props<{email: string; password: string;}>());
export const loginSuccess = createAction('[Auth Login page] Login Success', props<{user: User, redirect: boolean}>());
export const loginFail = createAction('[Auth Login Page] Login fail', props<{message: string}>());
export const relogin = createAction('[Auth Home page] Relogin');
export const logout = createAction('[Auth Header menu] Logout');

export const signupStart = createAction('[Auth Login Page] Sign up start', props<{email: string; password: string; asAdmin: boolean;}>());
export const signupFail = createAction('[Auth Login Page] Sign up fail', props<{message: string}>());

// Firebase
export const getAuthDataStart = createAction('[Auth Firebase] Get auth data start');
export const getAuthDataFail = createAction('[Auth Firebase] Get auth data fail', props<{message: string}>());
export const noAuthData = createAction('[Auth Firebase] No auth data');
export const getUserDataStart = createAction('[Auth Firebase] Get user data start', props<{uid: string | undefined}>());
export const getUserDataFail = createAction('[Auth Firebase] Get user data fail', props<{message: string}>());
export const setUserDataStart = createAction('[Auth Firebase] Set user data start', props<{user: User}>());
export const setUserDataFail = createAction('[Auth Firebase] Set user data fail', props<{message: string}>());
