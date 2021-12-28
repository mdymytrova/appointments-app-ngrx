import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ServiceProvider } from '../../interfaces/provider.interface';

export const providersLoad = createAction(
    '[Providers Resolver] Load providers'
);

export const providersLoadSuccess = createAction(
    '[Providers Load Effect] Load providers success',
    props<{providers: ServiceProvider[]}>()
)

export const providersLoadFail = createAction(
    '[Providers Load Effect] Load providers fail',
    props<{errorMessage: string}>()
)

export const providerUpdateStart = createAction(
    '[Provider Form] Update provider start',
    props<{update: Update<ServiceProvider>}>()
)

export const providerUpdateSuccess = createAction(
    '[Update Provider Start Effect] Update provider success',
    props<{update: Update<ServiceProvider>}>()
)

export const providerUpdateFail = createAction(
    '[Update Provider Start Effect] Update provider fail',
    props<{errorMessage: string}>()
)