import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementRoutingModule } from './management-routing.module';
import { MaterialModule } from '../material/material.module';
import { ManagementComponent } from './management.component';
import { ManagementTasksResolver } from './services/management-tasks.resolver';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { managementFeatureKey, managementReducer } from './store/reducers';
import { SharedModule } from '../shared/shared.module';
import { ManagementEffects } from './store/management.effects';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';
import { ProvidersDataService } from './providers/store/providers-data.service';
import { ManagementServiceDataService } from './management-services/store/management-service-data.service';
import { ManagementServicesResolver } from './management-services/services/management-services.resolver';
import { ManagementServiceEntityService } from './management-services/store/management-service-entity.service';
import { providerEntityMetadata } from './providers/store';
import { managementServiceEntityMetadata, serviceCategoryEntityMetadata } from './management-services/store';
import { ProvidersResolver } from './providers/services/providers.resolver';
import { ProviderEntityService } from './providers/store/provider-entity.service';
import { ServiceCategoryDataService } from './management-services/store/service-category-data.service';
import { ServiceCategoriesResolver } from './management-services/services/service-categories.resolver';
import { ServiceCategoryEntityService } from './management-services/store/service-category-entity.service';

@NgModule({
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ManagementRoutingModule,
    SharedModule,
    StoreModule.forFeature(managementFeatureKey, managementReducer),
    EffectsModule.forFeature([ManagementEffects])
  ],
  providers: [
    ManagementTasksResolver,
    ManagementServicesResolver,
    ManagementServiceEntityService,
    ManagementServiceDataService,
    ProvidersResolver,
    ProviderEntityService,
    ProvidersDataService,
    ServiceCategoriesResolver,
    ServiceCategoryEntityService,
    ServiceCategoryDataService
  ]
})
export class ManagementModule {
  constructor(
    private entityDefinitionService: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private providersDataService: ProvidersDataService,
    private servicesDataService: ManagementServiceDataService,
    private serviceCategoryDataService: ServiceCategoryDataService
  ) {
    entityDefinitionService.registerMetadataMap(providerEntityMetadata);
    entityDataService.registerService('Provider', providersDataService);

    entityDefinitionService.registerMetadataMap(managementServiceEntityMetadata);
    entityDataService.registerService('ManagementService', servicesDataService);

    entityDefinitionService.registerMetadataMap(serviceCategoryEntityMetadata);
    entityDataService.registerService('ServiceCategory', serviceCategoryDataService);
  }
}
