import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { ServiceCategory } from '../../interfaces/category.interface';

@Injectable()
export class ServiceCategoryEntityService extends EntityCollectionServiceBase<ServiceCategory> {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('ServiceCategory', serviceElementsFactory);
    }

}
