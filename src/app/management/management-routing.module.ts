import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { ManagementTasksResolver } from './services/management-tasks.resolver';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    resolve: {
      managenentTasks: ManagementTasksResolver
    },
    children: [
      { path: 'services',
        loadChildren: () => import('./management-services/management-services.module').then(m => m.ManagementServicesModule)
      },
      { path: 'service-providers',
        loadChildren: () => import('./providers/management-providers.module').then(m => m.ManagementProvidersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
