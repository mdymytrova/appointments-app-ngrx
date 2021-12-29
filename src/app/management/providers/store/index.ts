import { EntityMetadataMap } from '@ngrx/data';
import { ServiceProvider } from '../../interfaces/provider.interface';

export const providerEntityMetadata: EntityMetadataMap = {
    Provider: {
      filterFn: (entities: ServiceProvider[], search: string) => {
        return entities.filter(e => {
          const name = `${e?.contactInfo?.firstName} ${e?.contactInfo?.lastName}`.toLowerCase() || '';
          return name.indexOf(search.toLowerCase()) >= 0;
        });
      },
      sortComparer: (a, b) => a?.contactInfo?.lastName?.localeCompare(b?.contactInfo?.lastName),
      entityDispatcherOptions: {
        optimisticDelete: false
      }
    }
};