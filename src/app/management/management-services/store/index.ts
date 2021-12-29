import { EntityMetadataMap } from '@ngrx/data';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ManagementService } from '../../interfaces/service.interface';

export const managementServiceEntityMetadata: EntityMetadataMap = {
    ManagementService: {
      filterFn: (entities: ManagementService[], categoryId: string) => {
        return entities.filter(e => {
          if (categoryId == 'general') {
            return e.category === '';
          } else {
            return (e.category as ServiceCategory)?.id === categoryId;
          }
        });
      },
      entityDispatcherOptions: {
        optimisticDelete: false
      }
    }
};

export const serviceCategoryEntityMetadata: EntityMetadataMap = {
  ServiceCategory: {
    entityDispatcherOptions: {
      optimisticDelete: false
    }
  }
};