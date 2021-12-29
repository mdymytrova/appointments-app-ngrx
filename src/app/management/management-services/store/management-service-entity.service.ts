import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { ManagementService } from '../../interfaces/service.interface';

@Injectable()
export class ManagementServiceEntityService extends EntityCollectionServiceBase<ManagementService> {

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('ManagementService', serviceElementsFactory);
    }

}
