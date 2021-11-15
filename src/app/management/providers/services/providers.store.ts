import { Injectable } from '@angular/core';
import { StoreServiceNew } from '../../../core/services/store-new.service';
import { ServiceProvider } from '../../interfaces/provider.interface';

export interface IProvidersStore {
    providers: ServiceProvider[];
    selectedProvider: ServiceProvider | null;
    selectedProviderId: string | null;
};

@Injectable({
    providedIn: 'root'
})
export class ProvidersStore extends StoreServiceNew<IProvidersStore> {
    providers$ = this.select(state => state.providers);
    selectedProvider$ = this.select(state => {
        const provider = state.providers.find(provider => {
            return provider.id == state.selectedProviderId;
        });
        return provider || null;
    })

    constructor() {
        super({
            providers: [],
            selectedProvider: null,
            selectedProviderId: null
        });
    }
}