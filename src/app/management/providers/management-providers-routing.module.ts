import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderFormComponent } from './provider-form/provider-form.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderEditGuard } from './services/provider-edit.guard';

const routes: Routes = [
  {
    path: '',
    component: ProviderListComponent,
  },
  {
    path: 'create',
    component: ProviderFormComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id/edit',
    component: ProviderFormComponent,
    data: { mode: 'edit' },
    canActivate: [ProviderEditGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementProvidersRoutingModule { }
