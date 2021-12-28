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
  providers: [ManagementTasksResolver]
})
export class ManagementModule { }
