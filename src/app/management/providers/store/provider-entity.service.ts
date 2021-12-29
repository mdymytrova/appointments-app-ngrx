import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { ServiceProvider } from '../../interfaces/provider.interface';

@Injectable()
export class ProviderEntityService extends EntityCollectionServiceBase<ServiceProvider> {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Provider', serviceElementsFactory);
    }

}
