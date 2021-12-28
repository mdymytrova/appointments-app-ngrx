import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getError, LoadingState } from '../../../store/reducers';
import * as fromProviders from './reducers';

export const selectProvidersState = createFeatureSelector<fromProviders.ProvidersState>(fromProviders.providersFeatureKey);

export const providers = createSelector(
    selectProvidersState,
    fromProviders.selectAll
);

export const searchProviders = (search: string) => {
    return createSelector(
        providers,
        providers => {
            return providers.filter(provider => {
                const name = `${provider?.contactInfo?.firstName} ${provider?.contactInfo?.lastName}`.toLowerCase() || '';
                return name.indexOf(search.toLowerCase()) >= 0;
            });
        }
    );
}

export const selectedProvider = (id: string) => {
    return createSelector(
        providers,
        providers => {
            return providers.find(provider => {
                return provider?.id == id;
            });
        }
    );
}

export const loading = createSelector(
    selectProvidersState,
    state => state.callState === LoadingState.LOADING
);

export const providersLoaded = createSelector(
    selectProvidersState,
    state => {
        return state.callState === LoadingState.LOADED
    }
);

export const errorMessage = createSelector(
    selectProvidersState,
    state => {
        return getError(state.callState)
    }
);
