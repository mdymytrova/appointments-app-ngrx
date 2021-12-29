import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementProvidersRoutingModule } from './management-providers-routing.module';
import { MaterialModule } from '../../material/material.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderFormComponent } from './provider-form/provider-form.component';
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
    ManagementProvidersRoutingModule
  ]
})
export class ManagementProvidersModule {}
