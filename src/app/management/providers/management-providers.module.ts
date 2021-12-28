import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementProvidersRoutingModule } from './management-providers-routing.module';
import { MaterialModule } from '../../material/material.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderFormComponent } from './provider-form/provider-form.component';
import { ProvidersResolver } from './services/providers.resolver';
import { EffectsModule } from '@ngrx/effects';
import { ProvidersEffects } from './store/providers.effects';
import { StoreModule } from '@ngrx/store';
import { providersFeatureKey, providersReducer } from './store/reducers';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProviderListComponent,
    ProviderFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    ManagementProvidersRoutingModule,
    StoreModule.forFeature(providersFeatureKey, providersReducer),
    EffectsModule.forFeature([ProvidersEffects])
  ],
  providers: [ProvidersResolver]
})
export class ManagementProvidersModule { }
