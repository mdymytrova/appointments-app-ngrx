import { createAction, props } from '@ngrx/store';
import { User } from './auth.service';

export const login = createAction(
    '[Auth Service Firestore]: User Login',
    props<{user: User}>()
);

export const logout = createAction(
    '[Auth Service Firestore]: User Logout'
)