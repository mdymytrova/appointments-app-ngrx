import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CallState, LoadingState } from '../../../../store/reducers';
import { ServiceProvider } from '../../../interfaces/provider.interface';
import { ProvidersActions } from '../action-types';

export const providersFeatureKey = 'providers';

export interface ProvidersState extends EntityState<ServiceProvider>{
    callState: CallState
};

export const adapter = createEntityAdapter<ServiceProvider>({
    sortComparer: (a, b) => a?.contactInfo?.lastName?.localeCompare(b?.contactInfo?.lastName)
});

export const initialProvidersState: ProvidersState = adapter.getInitialState({
    callState: LoadingState.INIT
});

export const providersReducer = createReducer(
    initialProvidersState,
    on(ProvidersActions.providersLoad, (state, action) => {
        return {
            ...state,
            callState: LoadingState.LOADING
        }
    }),
    on(ProvidersActions.providersLoadSuccess, (state, {providers}) => {
        return adapter.setAll(providers, {
            ...state,
            callState: LoadingState.LOADED
        });
    }),
    on(ProvidersActions.providersLoadFail, (state, action) => {
        return {
            ...state,
            callState: {errorMessage: action.errorMessage}
        }
    }),
    on(ProvidersActions.providerUpdateStart, (state, action) => {
        return {
            ...state,
            callState: LoadingState.LOADING
        }
    }),
    on(ProvidersActions.providerUpdateSuccess, (state, action) => {
        return adapter.updateOne(action.update, {
            ...state, callState: LoadingState.LOADED
        })
    }),
    on(ProvidersActions.providerUpdateFail, (state, action) => {
        return {
            ...state,
            callState: {errorMessage: action.errorMessage}
        }
    })
);

export const { selectAll } = adapter.getSelectors();