import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementServiceFormComponent} from './management-service-form/management-service-form.component';
import { ManagementServiceListComponent } from './management-service-list/management-service-list.component';
import { ManagementServicesHomeComponent } from './management-services-home/management-services-home.component';
import { ServiceEditGuard } from './services/service-edit.guard';

const routes: Routes = [
  {
    path: '',
    component: ManagementServicesHomeComponent,
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
            canActivate: [ServiceEditGuard]
          },
          {
            path: '',
            redirectTo: 'general'
          }
        ]
      },
      {
        path: 'create',
        component: ManagementServiceFormComponent,
        data: { mode: 'create' }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementServicesRoutingModule { }
