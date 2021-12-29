import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementServiceFormComponent} from './management-service-form/management-service-form.component';
import { ManagementServiceListComponent } from './management-service-list/management-service-list.component';
import { ManagementServicesHomeComponent } from './management-services-home/management-services-home.component';
import { ManagementServicesResolver } from './services/management-services.resolver';
import { ServiceCategoriesResolver } from './services/service-categories.resolver';

const routes: Routes = [
  {
    path: '',
    component: ManagementServicesHomeComponent,
    resolve: {
      managementServices: ManagementServicesResolver,
      serviceCategories: ServiceCategoriesResolver
    },
    children: [
      {
        path: 'categories',
        children: [
          {
            path: 'create',
            component: ManagementServiceFormComponent,
            data: { mode: 'create' }
          },
          {
            path: ':id',
            component: ManagementServiceListComponent
          },
          {
            path: ':id/edit',
            component: ManagementServiceFormComponent,
            data: { mode: 'edit' },
          },
          {
            path: '',
            redirectTo: 'general'
          }
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementServicesRoutingModule { }
