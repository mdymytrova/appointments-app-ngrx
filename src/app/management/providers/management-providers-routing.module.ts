import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementServicesResolver } from '../management-services/services/management-services.resolver';
import { ProviderFormComponent } from './provider-form/provider-form.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProvidersResolver } from './services/providers.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProviderListComponent,
    resolve: {
      providers: ProvidersResolver
    }
  },
  {
    path: 'create',
    component: ProviderFormComponent,
    data: { mode: 'create' },
    resolve: {
      managementServices: ManagementServicesResolver
    }
  },
  {
    path: ':id/edit',
    component: ProviderFormComponent,
    data: { mode: 'edit' },
    resolve: {
      providers: ProvidersResolver,
      managementServices: ManagementServicesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementProvidersRoutingModule { }
